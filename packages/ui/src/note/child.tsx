import { NOSTR_MENTIONS } from "@lume/utils";
import { nanoid } from "nanoid";
import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import reactStringReplace from "react-string-replace";
import { User } from "../user";
import { Hashtag } from "./mentions/hashtag";
import { MentionUser } from "./mentions/user";
import { useEvent } from "@lume/ark";

export function NoteChild({
  eventId,
  isRoot,
}: {
  eventId: string;
  isRoot?: boolean;
}) {
  const { t } = useTranslation();
  const { isLoading, isError, data } = useEvent(eventId);

  const richContent = useMemo(() => {
    if (!data) return "";

    let parsedContent: string | ReactNode[] =
      data.content.substring(0, 160) + "...";

    const text = data.content;
    const words = text.split(/( |\n)/);

    const hashtags = words.filter((word) => word.startsWith("#"));
    const mentions = words.filter((word) =>
      NOSTR_MENTIONS.some((el) => word.startsWith(el)),
    );

    try {
      if (hashtags.length) {
        for (const hashtag of hashtags) {
          const regex = new RegExp(`(|^)${hashtag}\\b`, "g");
          parsedContent = reactStringReplace(parsedContent, regex, () => {
            return <Hashtag key={nanoid()} tag={hashtag} />;
          });
        }
      }

      if (mentions.length) {
        for (const mention of mentions) {
          parsedContent = reactStringReplace(
            parsedContent,
            mention,
            (match, i) => <MentionUser key={match + i} pubkey={mention} />,
          );
        }
      }

      parsedContent = reactStringReplace(
        parsedContent,
        /(https?:\/\/\S+)/g,
        (match, i) => {
          const url = new URL(match);
          return (
            <a
              key={match + i}
              href={url.toString()}
              target="_blank"
              rel="noreferrer"
              className="content-break font-normal text-blue-500 hover:text-blue-600"
            >
              {url.toString()}
            </a>
          );
        },
      );

      return parsedContent;
    } catch (e) {
      console.log(e);
      return parsedContent;
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="relative flex gap-3">
        <div className="relative flex-1 rounded-xl bg-neutral-100 p-3 text-sm dark:bg-neutral-900">
          Loading...
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="relative flex gap-3">
        <div className="relative flex-1 rounded-xl bg-neutral-100 p-3 text-sm dark:bg-neutral-900">
          {t("note.error")}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex gap-3">
      <div className="relative flex-1 rounded-xl bg-neutral-100 p-3 dark:bg-neutral-900">
        <div className="absolute right-0 top-[18px] h-3 w-3 -translate-y-1/2 translate-x-1/2 rotate-45 transform bg-neutral-100 dark:bg-neutral-900" />
        <div className="content-break mt-6 select-text leading-normal text-neutral-900 dark:text-neutral-100">
          {richContent}
        </div>
      </div>
      <User.Provider pubkey={data.pubkey}>
        <User.Root>
          <User.Avatar className="size-10 shrink-0 rounded-full object-cover" />
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 font-semibold leading-tight">
            <User.Name className="max-w-[10rem] truncate" />
            <div className="font-normal text-neutral-700 dark:text-neutral-300">
              {isRoot ? t("note.posted") : t("note.replied")}:
            </div>
          </div>
        </User.Root>
      </User.Provider>
    </div>
  );
}
