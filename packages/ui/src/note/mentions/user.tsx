import { useProfile } from "@lume/ark";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTranslation } from "react-i18next";

export function MentionUser({ pubkey }: { pubkey: string }) {
  const { isLoading, isError, user } = useProfile(pubkey);
  const { t } = useTranslation();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="break-words text-start text-blue-500 hover:text-blue-600">
        {isLoading
          ? "@anon"
          : isError
            ? pubkey
            : `@${user?.name || user?.display_name || user?.name || "anon"}`}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="flex w-[200px] flex-col overflow-hidden rounded-2xl bg-white/50 p-2 ring-1 ring-black/10 backdrop-blur-2xl focus:outline-none dark:bg-black/50 dark:ring-white/10">
        <DropdownMenu.Item asChild>
          <a
            href={`/users/${pubkey}`}
            className="inline-flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {t("note.buttons.viewProfile")}
          </a>
        </DropdownMenu.Item>
        <DropdownMenu.Item asChild>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {t("note.buttons.pin")}
          </button>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
