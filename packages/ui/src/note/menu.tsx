import { HorizontalDotsIcon } from "@lume/icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { useTranslation } from "react-i18next";
import { useNoteContext } from "./provider";
import { useArk } from "@lume/ark";

export function NoteMenu() {
  const ark = useArk();
  const event = useNoteContext();

  const { t } = useTranslation();

  const copyID = async () => {
    await writeText(await ark.event_to_bech32(event.id, [""]));
  };

  const copyRaw = async () => {
    await writeText(JSON.stringify(event));
  };

  const copyNpub = async () => {
    await writeText(await ark.user_to_bech32(event.pubkey, [""]));
  };

  const copyLink = async () => {
    await writeText(
      `https://njump.me/${await ark.event_to_bech32(event.id, [""])}`,
    );
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="group inline-flex size-7 items-center justify-center text-neutral-800 dark:text-neutral-200"
        >
          <HorizontalDotsIcon className="size-5" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="flex w-[200px] flex-col overflow-hidden rounded-2xl bg-white/50 p-2 ring-1 ring-black/10 backdrop-blur-2xl focus:outline-none dark:bg-black/50 dark:ring-white/10">
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={() => copyLink()}
              className="inline-flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {t("note.menu.viewThread")}
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {t("note.menu.copyLink")}
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={() => copyID()}
              className="inline-flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {t("note.menu.copyNoteId")}
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={() => copyNpub()}
              className="inline-flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {t("note.menu.copyAuthorId")}
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <a
              href={`/users/${event.pubkey}`}
              className="inline-flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {t("note.menu.viewAuthor")}
            </a>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {t("note.menu.pinAuthor")}
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-black/10 dark:bg-white/10" />
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={() => copyRaw()}
              className="inline-flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {t("note.menu.copyRaw")}
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
