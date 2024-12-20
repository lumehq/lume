import { commands } from "@/commands.gen";
import { cn, displayNpub } from "@/commons";
import { RepostIcon, Spinner } from "@/components";
import { settingsQueryOptions } from "@/routes/__root";
import type { Metadata } from "@/types";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { Menu, MenuItem } from "@tauri-apps/api/menu";
import { message } from "@tauri-apps/plugin-dialog";
import { useCallback, useTransition } from "react";
import { useNoteContext } from "../provider";

export function NoteRepost({
	label = false,
	smol = false,
}: { label?: boolean; smol?: boolean }) {
	const event = useNoteContext();
	const settings = useSuspenseQuery(settingsQueryOptions);
	const queryClient = useQueryClient();

	const { isLoading, data: status } = useQuery({
		queryKey: ["is-reposted", event.id],
		queryFn: async () => {
			const res = await commands.isReposted(event.id);
			if (res.status === "ok") {
				return res.data;
			} else {
				return false;
			}
		},
		enabled: settings.data.display_repost_button,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		staleTime: Number.POSITIVE_INFINITY,
		retry: false,
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
					text: `Repost as ${name} (${displayNpub(account, 16)})`,
					action: async () => submit(account),
				}),
			);
		}

		const items = await Promise.all(list);
		const menu = await Menu.new({ items });

		await menu.popup().catch((e) => console.error(e));
	}, []);

	const repost = useMutation({
		mutationFn: async () => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: ["is-reposted", event.id] });

			// Optimistically update to the new value
			queryClient.setQueryData(["is-reposted", event.id], true);

			const res = await commands.repost(JSON.stringify(event.raw));

			if (res.status === "ok") {
				return;
			} else {
				throw new Error(res.error);
			}
		},
		onError: () => {
			queryClient.setQueryData(["is-reposted", event.id], false);
		},
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: ["is-reposted", event.id],
			});
		},
	});

	const submit = (account: string) => {
		startTransition(async () => {
			if (!status) {
				const signer = await commands.hasSigner(account);

				if (signer.status === "ok") {
					if (!signer.data) {
						const res = await commands.setSigner(account);

						if (res.status === "error") {
							await message(res.error, { kind: "error" });
							return;
						}
					}

					repost.mutate();
				} else {
					return;
				}
			} else {
				return;
			}
		});
	};

	if (!settings.data.display_repost_button) return null;

	return (
		<Tooltip.Provider>
			<Tooltip.Root delayDuration={300}>
				<Tooltip.Trigger asChild>
					<button
						type="button"
						onClick={(e) => showContextMenu(e)}
						className={cn(
							"h-7 rounded-full inline-flex items-center justify-center text-neutral-800 hover:bg-black/5 dark:hover:bg-white/5 dark:text-neutral-200 text-sm font-medium",
							label ? "w-24 gap-1.5" : "w-14",
						)}
					>
						{isPending || isLoading ? (
							<Spinner className="size-4" />
						) : (
							<RepostIcon
								className={cn(
									smol ? "size-4" : "size-5",
									status ? "text-blue-500" : "",
								)}
							/>
						)}
						{label ? "Repost" : null}
					</button>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content className="inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-950 px-3.5 text-sm text-neutral-50 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-50 dark:text-neutral-950">
						Repost
						<Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}
