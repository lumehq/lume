import { RepostIcon } from "@lume/icons";
import { LumeWindow } from "@lume/system";
import { Spinner } from "@lume/ui";
import { cn } from "@lume/utils";
import { useRouteContext } from "@tanstack/react-router";
import { Menu, MenuItem } from "@tauri-apps/api/menu";
import { message } from "@tauri-apps/plugin-dialog";
import { useCallback, useState } from "react";
import { useNoteContext } from "../provider";

export function NoteRepost({ large = false }: { large?: boolean }) {
	const event = useNoteContext();
	const { settings } = useRouteContext({ strict: false });

	const [loading, setLoading] = useState(false);
	const [isRepost, setIsRepost] = useState(false);

	const repost = async () => {
		if (isRepost) return;

		try {
			setLoading(true);

			// repost
			await event.repost();

			// update state
			setLoading(false);
			setIsRepost(true);
		} catch {
			setLoading(false);
			await message("Repost failed, try again later", {
				title: "Lume",
				kind: "info",
			});
		}
	};

	const showContextMenu = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();

		const menuItems = await Promise.all([
			MenuItem.new({
				text: "Quote",
				action: async () => repost(),
			}),
			MenuItem.new({
				text: "Repost",
				action: () => LumeWindow.openEditor(null, event.id),
			}),
		]);

		const menu = await Menu.new({
			items: menuItems,
		});

		await menu.popup().catch((e) => console.error(e));
	}, []);

	if (!settings.display_repost_button) return null;

	return (
		<button
			type="button"
			onClick={(e) => showContextMenu(e)}
			className={cn(
				"inline-flex items-center justify-center text-neutral-800 dark:text-neutral-200 rounded-full",
				large
					? "bg-neutral-100 dark:bg-white/10 h-7 gap-1.5 w-24 text-sm font-medium hover:text-blue-500 hover:bg-neutral-200 dark:hover:bg-white/20"
					: "size-7",
			)}
		>
			{loading ? (
				<Spinner className="size-4" />
			) : (
				<RepostIcon className={cn("size-4", isRepost ? "text-blue-500" : "")} />
			)}
			{large ? "Repost" : null}
		</button>
	);
}
