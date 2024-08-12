import { cn } from "@/commons";
import { LumeWindow } from "@/system";
import { Menu, MenuItem } from "@tauri-apps/api/menu";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { useCallback } from "react";
import { User } from "../user";
import { useNoteContext } from "./provider";

export function NoteUser({ className }: { className?: string }) {
	const event = useNoteContext();

	const showContextMenu = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();

		const menuItems = await Promise.all([
			MenuItem.new({
				text: "View Profile",
				action: () => LumeWindow.openProfile(event.pubkey),
			}),
			MenuItem.new({
				text: "Copy Public Key",
				action: async () => {
					const pubkey = await event.pubkeyAsBech32();
					await writeText(pubkey);
				},
			}),
		]);

		const menu = await Menu.new({
			items: menuItems,
		});

		await menu.popup().catch((e) => console.error(e));
	}, []);

	return (
		<User.Provider pubkey={event.pubkey}>
			<User.Root className={cn("flex items-start justify-between", className)}>
				<div className="flex w-full gap-2">
					<button
						type="button"
						onClick={(e) => showContextMenu(e)}
						className="shrink-0"
					>
						<User.Avatar className="rounded-full size-8" />
					</button>
					<div className="flex items-center w-full gap-3">
						<div className="flex items-center gap-1">
							<User.Name className="font-semibold text-neutral-950 dark:text-neutral-50" />
							<User.NIP05 />
						</div>
						<div className="text-neutral-600 dark:text-neutral-400">·</div>
						<User.Time
							time={event.created_at}
							className="text-neutral-600 dark:text-neutral-400"
						/>
					</div>
				</div>
			</User.Root>
		</User.Provider>
	);
}
