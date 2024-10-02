import { appSettings, cn } from "@/commons";
import * as Avatar from "@radix-ui/react-avatar";
import { useStore } from "@tanstack/react-store";
import { minidenticon } from "minidenticons";
import { useMemo } from "react";
import { useUserContext } from "./provider";

export function UserAvatar({ className }: { className?: string }) {
	const [service, visible] = useStore(appSettings, (state) => [
		state.image_resize_service,
		state.display_avatar,
	]);

	const user = useUserContext();

	const picture = useMemo(() => {
		if (service?.length && user.profile?.picture?.length) {
			if (user.profile?.picture.includes("_next/")) {
				return user.profile?.picture;
			}
			return `${service}?url=${user.profile?.picture}&w=100&h=100&n=-1&default=${user.profile?.picture}`;
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

	return (
		<Avatar.Root
			className={cn(
				"shrink-0 block overflow-hidden bg-neutral-200 dark:bg-neutral-800",
				className,
			)}
		>
			{visible ? (
				<Avatar.Image
					src={picture}
					alt={user.pubkey}
					decoding="async"
					className="w-full aspect-square object-cover outline-[.5px] outline-black/5 content-visibility-auto contain-intrinsic-size-[auto]"
				/>
			) : null}
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
