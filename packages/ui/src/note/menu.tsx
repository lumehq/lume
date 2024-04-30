import { HorizontalDotsIcon } from "@lume/icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { useTranslation } from "react-i18next";
import { useNoteContext } from "./provider";
import { toast } from "sonner";
import { useRouteContext } from "@tanstack/react-router";

export function NoteMenu() {
	const event = useNoteContext();

	const { ark } = useRouteContext({ strict: false });
	const { t } = useTranslation();

	const copyID = async () => {
		await writeText(await ark.event_to_bech32(event.id, [""]));
		toast.success("Copied");
	};

	const copyRaw = async () => {
		await writeText(JSON.stringify(event));
		toast.success("Copied");
	};

	const copyNpub = async () => {
		await writeText(await ark.user_to_bech32(event.pubkey, [""]));
		toast.success("Copied");
	};

	const copyLink = async () => {
		await writeText(
			`https://njump.me/${await ark.event_to_bech32(event.id, [""])}`,
		);
		toast.success("Copied");
	};

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button
					type="button"
					className="group inline-flex size-7 items-center justify-center text-neutral-600 dark:text-neutral-400"
				>
					<HorizontalDotsIcon className="size-5" />
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content className="flex w-[200px] flex-col overflow-hidden rounded-xl bg-black p-1 shadow-md shadow-neutral-500/20 focus:outline-none dark:bg-white">
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => ark.open_thread(event.id)}
							className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-white hover:bg-neutral-900 focus:outline-none dark:text-black dark:hover:bg-neutral-100"
						>
							{t("note.menu.viewThread")}
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => copyLink()}
							className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-white hover:bg-neutral-900 focus:outline-none dark:text-black dark:hover:bg-neutral-100"
						>
							{t("note.menu.copyLink")}
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => copyID()}
							className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-white hover:bg-neutral-900 focus:outline-none dark:text-black dark:hover:bg-neutral-100"
						>
							{t("note.menu.copyNoteId")}
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => copyNpub()}
							className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-white hover:bg-neutral-900 focus:outline-none dark:text-black dark:hover:bg-neutral-100"
						>
							{t("note.menu.copyAuthorId")}
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<button
							onClick={() => ark.open_profile(event.pubkey)}
							className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-white hover:bg-neutral-900 focus:outline-none dark:text-black dark:hover:bg-neutral-100"
						>
							{t("note.menu.viewAuthor")}
						</button>
					</DropdownMenu.Item>
					<DropdownMenu.Separator className="my-1 h-px bg-neutral-900 dark:bg-neutral-100" />
					<DropdownMenu.Item asChild>
						<button
							type="button"
							onClick={() => copyRaw()}
							className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-white hover:bg-neutral-900 focus:outline-none dark:text-black dark:hover:bg-neutral-100"
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
