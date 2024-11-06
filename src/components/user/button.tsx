import { commands } from "@/commands.gen";
import { cn, displayNpub } from "@/commons";
import { Spinner } from "@/components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "@tauri-apps/plugin-dialog";
import { useCallback, useTransition } from "react";
import { useUserContext } from "./provider";
import type { Metadata } from "@/types";
import { MenuItem, Menu } from "@tauri-apps/api/menu";

export function UserButton({ className }: { className?: string }) {
	const user = useUserContext();
	const queryClient = useQueryClient();

	const {
		isLoading,
		isError,
		data: isFollow,
	} = useQuery({
		queryKey: ["status", user?.pubkey],
		queryFn: async () => {
			if (!user) {
				throw new Error("User not found");
			}

			const res = await commands.isContact(user.pubkey);

			if (res.status === "ok") {
				return res.data;
			} else {
				throw new Error(res.error);
			}
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		retry: 2,
	});

	const [isPending, startTransition] = useTransition();

	const showContextMenu = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();

		const accounts = await commands.getAccounts();
		const list: Promise<MenuItem>[] = [];

		for (const account of accounts) {
			const res = await commands.getProfile(account);
			let name = "unknown";

			if (res.status === "ok") {
				const profile: Metadata = JSON.parse(res.data);
				name = profile.display_name ?? profile.name ?? "anon";
			}

			list.push(
				MenuItem.new({
					text: `Follow as ${name} (${displayNpub(account, 16)})`,
					action: async () => submit(account),
				}),
			);
		}

		const items = await Promise.all(list);
		const menu = await Menu.new({ items });

		await menu.popup().catch((e) => console.error(e));
	}, []);

	const toggleFollow = useMutation({
		mutationFn: async () => {
			if (!user) return;

			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: ["status", user.pubkey] });

			// Optimistically update to the new value
			queryClient.setQueryData(
				["status", user.pubkey],
				(data: boolean) => !data,
			);

			const res = await commands.toggleContact(user.pubkey, null);

			if (res.status === "ok") {
				return;
			} else {
				throw new Error(res.error);
			}
		},
		onError: () => {
			queryClient.setQueryData(["status", user?.pubkey], false);
		},
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: ["status", user?.pubkey],
			});
		},
	});

	const submit = (account: string) => {
		startTransition(async () => {
			if (!status) {
				const signer = await commands.hasSigner(account);

				if (signer.status === "ok") {
					if (!signer.data) {
						if (!signer.data) {
							const res = await commands.setSigner(account);

							if (res.status === "error") {
								await message(res.error, { kind: "error" });
								return;
							}
						}
					}

					toggleFollow.mutate();
				} else {
					return;
				}
			} else {
				return;
			}
		});
	};

	return (
		<button
			type="button"
			disabled={isPending || isLoading}
			onClick={(e) => showContextMenu(e)}
			className={cn("w-max gap-1", className)}
		>
			{isError ? "Error" : null}
			{isPending || isLoading ? <Spinner className="size-3" /> : null}
			{isFollow ? "Unfollow" : "Follow"}
		</button>
	);
}
