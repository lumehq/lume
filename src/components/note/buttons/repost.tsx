import { appSettings, cn } from "@/commons";
import { Spinner } from "@/components";
import { LumeWindow } from "@/system";
import { Repeat } from "@phosphor-icons/react";
import { useStore } from "@tanstack/react-store";
import { Menu, MenuItem } from "@tauri-apps/api/menu";
import { message } from "@tauri-apps/plugin-dialog";
import { useCallback, useState } from "react";
import { useNoteContext } from "../provider";

export function NoteRepost({ large = false }: { large?: boolean }) {
	const visible = useStore(appSettings, (state) => state.display_repost_button);
	const event = useNoteContext();

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
				text: "Repost",
				action: async () => repost(),
			}),
			MenuItem.new({
				text: "Quote",
				action: () => LumeWindow.openEditor(null, event.id),
			}),
		]);

		const menu = await Menu.new({
			items: menuItems,
		});

		await menu.popup().catch((e) => console.error(e));
	}, []);

	if (!visible) return null;

	return (
		<button
			type="button"
			onClick={(e) => showContextMenu(e)}
			className={cn(
				"inline-flex items-center justify-center text-neutral-800 dark:text-neutral-200",
				large
					? "rounded-full h-7 gap-1.5 w-24 text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10"
					: "size-7",
			)}
		>
			{loading ? (
				<Spinner className="size-4" />
			) : (
				<Repeat className={cn("size-4", isRepost ? "text-blue-500" : "")} />
			)}
			{large ? "Repost" : null}
		</button>
	);
}
