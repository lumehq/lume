import { commands } from "@/commands.gen";
import { DotsThree } from "@phosphor-icons/react";
import { useSearch } from "@tanstack/react-router";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { nip19 } from "nostr-tools";
import { useCallback } from "react";
import { useNoteContext } from "./provider";

export function NoteMenu() {
	const event = useNoteContext();
	const { account }: { account: string } = useSearch({ strict: false });

	const showContextMenu = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();

		const list = [
			MenuItem.new({
				text: "Copy ID",
				action: async () => {
					const eventId = await event.idAsBech32();
					await writeText(eventId);
				},
			}),
			MenuItem.new({
				text: "Copy author",
				action: async () => {
					const pubkey = await event.pubkeyAsBech32();
					await writeText(pubkey);
				},
			}),
			MenuItem.new({
				text: "Copy sharable link",
				action: async () => {
					const eventId = await event.idAsBech32();
					await writeText(`https://njump.me/${eventId}`);
				},
			}),
			PredefinedMenuItem.new({ item: "Separator" }),
			MenuItem.new({
				text: "Copy raw event",
				action: async () => {
					event.meta = undefined;
					await writeText(JSON.stringify(event));
				},
			}),
		];

		if (account?.length) {
			const pubkey = nip19.decode(account).data;

			if (event.pubkey === pubkey) {
				list.push(
					MenuItem.new({
						text: "Request delete",
						action: async () => {
							await commands.requestDelete(event.id);
						},
					}),
				);
			}
		}

		const items = await Promise.all(list);
		const menu = await Menu.new({ items });

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
