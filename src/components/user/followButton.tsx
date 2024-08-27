import { commands } from "@/commands.gen";
import { cn } from "@/commons";
import { Spinner } from "@/components";
import { NostrAccount } from "@/system";
import { message } from "@tauri-apps/plugin-dialog";
import { useEffect, useState, useTransition } from "react";
import { useUserContext } from "./provider";

export function UserFollowButton({
	simple = false,
	className,
}: {
	simple?: boolean;
	className?: string;
}) {
	const user = useUserContext();

	const [followed, setFollowed] = useState(false);
	const [isPending, startTransition] = useTransition();

	const toggleFollow = () => {
		startTransition(async () => {
			const res = await commands.toggleContact(user.pubkey, null);

			if (res.status === "ok") {
				setFollowed((prev) => !prev);
			} else {
				await message(res.error, { kind: "error" });
				return;
			}
		});
	};

	useEffect(() => {
		let mounted = true;

		NostrAccount.checkContact(user.pubkey).then((status) => {
			if (mounted) setFollowed(status);
		});

		return () => {
			mounted = false;
		};
	}, []);

	return (
		<button
			type="button"
			disabled={isPending}
			onClick={() => toggleFollow()}
			className={cn("w-max", className)}
		>
			{isPending ? (
				<Spinner className="size-4" />
			) : followed ? (
				!simple ? (
					"Unfollow"
				) : null
			) : (
				"Follow"
			)}
		</button>
	);
}
