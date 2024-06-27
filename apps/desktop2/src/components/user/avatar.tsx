import { cn } from "@lume/utils";
import * as Avatar from "@radix-ui/react-avatar";
import { useRouteContext } from "@tanstack/react-router";
import { minidenticon } from "minidenticons";
import { nanoid } from "nanoid";
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

	const fallbackAvatar = useMemo(
		() =>
			`data:image/svg+xml;utf8,${encodeURIComponent(
				minidenticon(user.pubkey || nanoid(), 90, 50),
			)}`,
		[user.pubkey],
	);

	if (settings && !settings.display_avatar) {
		return (
			<Avatar.Root className="shrink-0">
				<Avatar.Fallback delayMs={120}>
					<img
						src={fallbackAvatar}
						alt={user.pubkey}
						loading="lazy"
						decoding="async"
						className={cn("bg-black dark:bg-white", className)}
					/>
				</Avatar.Fallback>
			</Avatar.Root>
		);
	}

	return (
		<Avatar.Root className="shrink-0">
			<Avatar.Image
				src={picture}
				alt={user.pubkey}
				loading="lazy"
				decoding="async"
				className={cn(
					"outline-[.5px] outline-black/5 object-cover content-visibility-auto contain-intrinsic-size-[auto]",
					className,
				)}
			/>
			<Avatar.Fallback delayMs={120}>
				<img
					src={fallbackAvatar}
					alt={user.pubkey}
					loading="lazy"
					decoding="async"
					className={cn("bg-black dark:bg-white", className)}
				/>
			</Avatar.Fallback>
		</Avatar.Root>
	);
}
