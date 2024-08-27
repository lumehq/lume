import { DotsThree } from "@phosphor-icons/react";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { useCallback } from "react";
import { useNoteContext } from "./provider";

export function NoteMenu() {
	const event = useNoteContext();

	const showContextMenu = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();

		const menuItems = await Promise.all([
			MenuItem.new({
				text: "Copy Sharable Link",
				action: async () => {
					const eventId = await event.idAsBech32();
					await writeText(`https://njump.me/${eventId}`);
				},
			}),
			MenuItem.new({
				text: "Copy Event ID",
				action: async () => {
					const eventId = await event.idAsBech32();
					await writeText(eventId);
				},
			}),
			MenuItem.new({
				text: "Copy Public Key",
				action: async () => {
					const pubkey = await event.pubkeyAsBech32();
					await writeText(pubkey);
				},
			}),
			PredefinedMenuItem.new({ item: "Separator" }),
			MenuItem.new({
				text: "Copy Raw Event",
				action: async () => {
					event.meta = undefined;
					const raw = JSON.stringify(event);
					await writeText(raw);
				},
			}),
		]);

		const menu = await Menu.new({
			items: menuItems,
		});

		await menu.popup().catch((e) => console.error(e));
	}, []);

	return (
		<button
			type="button"
			onClick={(e) => showContextMenu(e)}
			className="inline-flex items-center justify-center group size-7 text-neutral-600 dark:text-neutral-400"
		>
			<DotsThree className="size-5" />
		</button>
	);
}
