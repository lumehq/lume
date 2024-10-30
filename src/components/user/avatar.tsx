import { cn } from "@/commons";
import { settingsQueryOptions } from "@/routes/__root";
import * as Avatar from "@radix-ui/react-avatar";
import { useSuspenseQuery } from "@tanstack/react-query";
import { minidenticon } from "minidenticons";
import { useMemo } from "react";
import { useUserContext } from "./provider";

export function UserAvatar({ className }: { className?: string }) {
	const settings = useSuspenseQuery(settingsQueryOptions);

	const user = useUserContext();

	const picture = useMemo(() => {
		if (settings.data.resize_service && user?.profile?.picture?.length) {
			if (user.profile?.picture.includes("_next/")) {
				return user.profile?.picture;
			}
			if (user.profile?.picture.includes("bsky.network")) {
				return user.profile?.picture;
			}
			return `https://wsrv.nl?url=${user.profile?.picture}&w=100&h=100&n=-1&default=${user.profile?.picture}`;
		} else {
			return user?.profile?.picture;
		}
	}, [user]);

	const fallback = useMemo(
		() =>
			`data:image/svg+xml;utf8,${encodeURIComponent(
				minidenticon(user ? user.pubkey : "lume", 60, 50),
			)}`,
		[user],
	);

	return (
		<Avatar.Root
			className={cn(
				"shrink-0 block overflow-hidden bg-neutral-200 dark:bg-neutral-800",
				className,
			)}
		>
			{settings.data.display_avatar ? (
				<Avatar.Image
					src={picture}
					alt={user?.pubkey}
					decoding="async"
					onContextMenu={(e) => e.preventDefault()}
					className="w-full aspect-square object-cover outline-[.5px] outline-black/5 content-visibility-auto contain-intrinsic-size-[auto]"
				/>
			) : null}
			<Avatar.Fallback>
				<img
					src={fallback}
					alt={user?.pubkey}
					className="size-full bg-black dark:bg-white outline-[.5px] outline-black/5 content-visibility-auto contain-intrinsic-size-[auto]"
				/>
			</Avatar.Fallback>
		</Avatar.Root>
	);
}
