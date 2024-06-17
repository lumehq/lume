import { HorizontalDotsIcon } from "@lume/icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { useTranslation } from "react-i18next";
import { useNoteContext } from "./provider";
import { LumeWindow } from "@lume/system";

export function NoteMenu() {
	const { t } = useTranslation();
	const event = useNoteContext();

	const copyID = async () => {
		await writeText(await event.idAsBech32());
	};

	const copyRaw = async () => {
		await writeText(JSON.stringify(event));
	};

	const copyNpub = async () => {
		await writeText(await event.pubkeyAsBech32());
	};

	const copyLink = async () => {
		await writeText(`https://njump.me/${await event.idAsBech32()}`);
	};

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button
					type="button"
					className="inline-flex items-center justify-center group size-7 text-neutral-600 dark:text-neutral-400"
				>
					<HorizontalDotsIcon className="size-5" />
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content className="flex w-[200px] flex-col overflow-hidden rounded-xl bg-black p-1 shadow-md shadow-neutral-500/20 focus:outline-none dark:bg-white">
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => LumeWindow.openEvent(event)}
							className="inline-flex items-center gap-2 px-3 text-sm font-medium text-white rounded-lg h-9 hover:bg-neutral-900 focus:outline-none dark:text-black dark:hover:bg-neutral-100"
						>
							{t("note.menu.viewThread")}
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => copyLink()}
							className="inline-flex items-center gap-2 px-3 text-sm font-medium text-white rounded-lg h-9 hover:bg-neutral-900 focus:outline-none dark:text-black dark:hover:bg-neutral-100"
						>
							{t("note.menu.copyLink")}
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => copyID()}
							className="inline-flex items-center gap-2 px-3 text-sm font-medium text-white rounded-lg h-9 hover:bg-neutral-900 focus:outline-none dark:text-black dark:hover:bg-neutral-100"
						>
							{t("note.menu.copyNoteId")}
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => copyNpub()}
							className="inline-flex items-center gap-2 px-3 text-sm font-medium text-white rounded-lg h-9 hover:bg-neutral-900 focus:outline-none dark:text-black dark:hover:bg-neutral-100"
						>
							{t("note.menu.copyAuthorId")}
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => LumeWindow.openProfile(event.pubkey)}
							className="inline-flex items-center gap-2 px-3 text-sm font-medium text-white rounded-lg h-9 hover:bg-neutral-900 focus:outline-none dark:text-black dark:hover:bg-neutral-100"
						>
							{t("note.menu.viewAuthor")}
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Separator className="h-px my-1 bg-neutral-900 dark:bg-neutral-100" />
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => copyRaw()}
							className="inline-flex items-center gap-2 px-3 text-sm font-medium text-white rounded-lg h-9 hover:bg-neutral-900 focus:outline-none dark:text-black dark:hover:bg-neutral-100"
						>
							{t("note.menu.copyRaw")}
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Arrow className="fill-black dark:fill-white" />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
