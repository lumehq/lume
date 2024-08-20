import { cn } from "@/commons";
import * as Avatar from "@radix-ui/react-avatar";
import { useRouteContext } from "@tanstack/react-router";
import { minidenticon } from "minidenticons";
import { useMemo } from "react";
import { useUserContext } from "./provider";

export function UserAvatar({ className }: { className?: string }) {
	const user = useUserContext();
	const { settings } = useRouteContext({ strict: false });

	const picture = useMemo(() => {
		if (
			settings?.image_resize_service?.length &&
			user.profile?.picture?.length
		) {
			const url = `${settings.image_resize_service}?url=${user.profile?.picture}&w=100&h=100&default=1&n=-1`;
			return url;
		} else {
			return user.profile?.picture;
		}
	}, [user.profile?.picture]);

	const fallback = useMemo(
		() =>
			`data:image/svg+xml;utf8,${encodeURIComponent(
				minidenticon(user.pubkey, 60, 50),
			)}`,
		[user.pubkey],
	);

	if (settings && !settings.display_avatar) {
		return (
			<Avatar.Root
				className={cn(
					"shrink-0 block overflow-hidden bg-neutral-200 dark:bg-neutral-800",
					className,
				)}
			>
				<Avatar.Fallback delayMs={120}>
					<img
						src={fallback}
						alt={user.pubkey}
						loading="lazy"
						decoding="async"
						className="size-full bg-black dark:bg-white outline-[.5px] outline-black/5 content-visibility-auto contain-intrinsic-size-[auto]"
					/>
				</Avatar.Fallback>
			</Avatar.Root>
		);
	}

	return (
		<Avatar.Root
			className={cn(
				"shrink-0 block overflow-hidden bg-neutral-200 dark:bg-neutral-800",
				className,
			)}
		>
			<Avatar.Image
				src={picture}
				alt={user.pubkey}
				decoding="async"
				className="w-full aspect-square object-cover outline-[.5px] outline-black/5 content-visibility-auto contain-intrinsic-size-[auto]"
			/>
			<Avatar.Fallback>
				<img
					src={fallback}
					alt={user.pubkey}
					className="size-full bg-black dark:bg-white outline-[.5px] outline-black/5 content-visibility-auto contain-intrinsic-size-[auto]"
				/>
			</Avatar.Fallback>
		</Avatar.Root>
	);
}
