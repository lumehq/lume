import { LoaderIcon, ReplyIcon, RepostIcon } from "@lume/icons";
import { cn, editorAtom, editorValueAtom } from "@lume/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useNoteContext } from "../provider";
import { useArk } from "@lume/ark";

export function NoteRepost() {
  const ark = useArk();
  const event = useNoteContext();
  const setEditorValue = useSetAtom(editorValueAtom);
  const setIsEditorOpen = useSetAtom(editorAtom);

  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isRepost, setIsRepost] = useState(false);
  const [open, setOpen] = useState(false);

  const repost = async () => {
    try {
      setLoading(true);

      // repost
      await ark.repost(event.id, event.pubkey);

      // update state
      setLoading(false);
      setIsRepost(true);

      // notify
      toast.success("You've reposted this post successfully");
    } catch (e) {
      setLoading(false);
      toast.error("Repost failed, try again later");
    }
  };

  const quote = () => {
    setEditorValue([
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
      {
        type: "event",
        // @ts-expect-error, useless
        eventId: `nostr:${nip19.noteEncode(event.id)}`,
        children: [{ text: "" }],
      },
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ]);
    setIsEditorOpen(true);
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <Tooltip.Provider>
        <Tooltip.Root delayDuration={150}>
          <DropdownMenu.Trigger asChild>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                className="group inline-flex h-7 w-7 items-center justify-center text-neutral-800 dark:text-neutral-200"
              >
                {loading ? (
                  <LoaderIcon className="size-4 animate-spin" />
                ) : (
                  <RepostIcon
                    className={cn(
                      "size-5 group-hover:text-blue-600",
                      isRepost ? "text-blue-500" : "",
                    )}
                  />
                )}
              </button>
            </Tooltip.Trigger>
          </DropdownMenu.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className="data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-950 px-3.5 text-sm text-neutral-50 will-change-[transform,opacity] dark:bg-neutral-50 dark:text-neutral-950">
              {t("note.buttons.repost")}
              <Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="flex w-[200px] flex-col overflow-hidden rounded-2xl bg-white/50 p-2 ring-1 ring-black/10 backdrop-blur-2xl focus:outline-none dark:bg-black/50 dark:ring-white/10">
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={repost}
              className="inline-flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <RepostIcon className="size-4" />
              {t("note.buttons.repost")}
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={quote}
              className="inline-flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <ReplyIcon className="size-4" />
              {t("note.buttons.quote")}
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
