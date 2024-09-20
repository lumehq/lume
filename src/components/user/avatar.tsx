import { appSettings, cn } from "@/commons";
import { LumeWindow } from "@/system";
import * as Avatar from "@radix-ui/react-avatar";
import { useStore } from "@tanstack/react-store";
import { Menu, MenuItem } from "@tauri-apps/api/menu";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { minidenticon } from "minidenticons";
import { useCallback, useMemo } from "react";
import { useUserContext } from "./provider";

export function UserAvatar({ className }: { className?: string }) {
	const [service, visible] = useStore(appSettings, (state) => [
		state.image_resize_service,
		state.display_avatar,
	]);

	const user = useUserContext();

	const picture = useMemo(() => {
		if (service?.length && user.profile?.picture?.length) {
			const url = `${service}?url=${user.profile?.picture}&w=100&h=100&default=1&n=-1`;
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

	const showContextMenu = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();

		const menuItems = await Promise.all([
			MenuItem.new({
				text: "View Profile",
				action: () => LumeWindow.openProfile(user.pubkey),
			}),
			MenuItem.new({
				text: "Copy Public Key",
				action: async () => {
					await writeText(user.pubkey);
				},
			}),
		]);

		const menu = await Menu.new({
			items: menuItems,
		});

		await menu.popup().catch((e) => console.error(e));
	}, []);

	return (
		<Avatar.Root
			onClick={(e) => showContextMenu(e)}
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
