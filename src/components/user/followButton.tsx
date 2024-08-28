import { commands } from "@/commands.gen";
import { cn } from "@/commons";
import { Spinner } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { message } from "@tauri-apps/plugin-dialog";
import { useTransition } from "react";
import { useUserContext } from "./provider";

export function UserFollowButton({ className }: { className?: string }) {
	const user = useUserContext();

	const { queryClient } = useRouteContext({ strict: false });
	const {
		isLoading,
		isError,
		data: isFollow,
	} = useQuery({
		queryKey: ["status", user.pubkey],
		queryFn: async () => {
			const res = await commands.checkContact(user.pubkey);

			if (res.status === "ok") {
				return res.data;
			} else {
				throw new Error(res.error);
			}
		},
		refetchOnWindowFocus: false,
	});

	const [isPending, startTransition] = useTransition();

	const toggleFollow = () => {
		startTransition(async () => {
			const res = await commands.toggleContact(user.pubkey, null);

			if (res.status === "ok") {
				queryClient.setQueryData(
					["status", user.pubkey],
					(prev: boolean) => !prev,
				);

				// invalidate cache
				await queryClient.invalidateQueries({
					queryKey: ["status", user.pubkey],
				});

				return;
			} else {
				await message(res.error, { kind: "error" });
				return;
			}
		});
	};

	return (
		<button
			type="button"
			disabled={isPending}
			onClick={() => toggleFollow()}
			className={cn("w-max", className)}
		>
			{isError ? "Error" : null}
			{isPending || isLoading ? <Spinner className="size-4" /> : null}
			{isFollow ? "Unfollow" : "Follow"}
		</button>
	);
}
