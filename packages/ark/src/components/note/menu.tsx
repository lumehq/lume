import { HorizontalDotsIcon } from "@lume/icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { nip19 } from "nostr-tools";
import { type EventPointer } from "nostr-tools/lib/types/nip19";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useNoteContext } from "./provider";

export function NoteMenu() {
	const event = useNoteContext();
	const navigate = useNavigate();

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

	const copyNpub = async () => {
		await writeText(nip19.npubEncode(event.pubkey));
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

	const muteUser = async () => {
		event.muted();
		toast.info("You've muted this user");
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
				<DropdownMenu.Content className="flex w-[200px] p-2 flex-col overflow-hidden rounded-2xl bg-white/50 dark:bg-black/50 ring-1 ring-black/10 dark:ring-white/10 backdrop-blur-2xl focus:outline-none">
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => copyLink()}
							className="inline-flex items-center gap-3 px-3 text-sm font-medium rounded-lg h-9 text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
						>
							View thread
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => navigate(`/events/${event.id}`)}
							className="inline-flex items-center gap-3 px-3 text-sm font-medium rounded-lg h-9 text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
						>
							Copy shareable link
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => copyID()}
							className="inline-flex items-center gap-3 px-3 text-sm font-medium rounded-lg h-9 text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
						>
							Copy note ID
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => copyNpub()}
							className="inline-flex items-center gap-3 px-3 text-sm font-medium rounded-lg h-9 text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
						>
							Copy author ID
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<Link
							to={`/users/${event.pubkey}`}
							className="inline-flex items-center gap-3 px-3 text-sm font-medium rounded-lg h-9 text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
						>
							View profile
						</Link>
					</DropdownMenu.Item>
					<DropdownMenu.Separator className="h-px my-1 bg-black/10 dark:bg-white/10" />
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => copyRaw()}
							className="inline-flex items-center gap-3 px-3 text-sm font-medium rounded-lg h-9 text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
						>
							Copy raw event
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={muteUser}
							className="inline-flex items-center gap-3 px-3 text-sm font-medium text-red-500 rounded-lg h-9 hover:bg-red-500 hover:text-red-50 focus:outline-none"
						>
							Mute
						</button>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
