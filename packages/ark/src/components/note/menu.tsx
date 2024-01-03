import { HorizontalDotsIcon, ShareIcon } from "@lume/icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { nip19 } from "nostr-tools";
import { EventPointer } from "nostr-tools/lib/types/nip19";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNoteContext } from "./provider";

export function NoteMenu() {
	const event = useNoteContext();
	const [open, setOpen] = useState(false);

	const copyID = async () => {
		await writeText(
			nip19.neventEncode({
				id: event.id,
				author: event.pubkey,
			} as EventPointer),
		);
		setOpen(false);
	};

	const copyRaw = async () => {
		await writeText(JSON.stringify(await event.toNostrEvent()));
	};

	const copyLink = async () => {
		await writeText(
			`https://njump.me/${nip19.neventEncode({
				id: event.id,
				author: event.pubkey,
			} as EventPointer)}`,
		);
		setOpen(false);
	};

	return (
		<DropdownMenu.Root open={open} onOpenChange={setOpen}>
			<DropdownMenu.Trigger asChild>
				<button
					type="button"
					className="inline-flex items-center justify-center w-6 h-6"
				>
					<HorizontalDotsIcon className="w-4 h-4 text-neutral-800 hover:text-blue-500 dark:text-neutral-200" />
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content className="flex w-[200px] p-2 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-neutral-950 focus:outline-none dark:border-neutral-900">
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => copyLink()}
							className="inline-flex items-center h-10 px-4 text-sm text-white rounded-lg hover:bg-neutral-900 focus:outline-none"
						>
							Copy shareable link
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => copyID()}
							className="inline-flex items-center h-10 px-4 text-sm text-white rounded-lg hover:bg-neutral-900 focus:outline-none"
						>
							Copy note ID
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => copyRaw()}
							className="inline-flex items-center h-10 px-4 text-sm text-white rounded-lg hover:bg-neutral-900 focus:outline-none"
						>
							Copy raw event
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<Link
							to={`/users/${event.pubkey}`}
							className="inline-flex items-center h-10 px-4 text-sm text-white rounded-lg hover:bg-neutral-900 focus:outline-none"
						>
							View profile
						</Link>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
