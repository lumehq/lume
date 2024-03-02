import { NOSTR_MENTIONS } from "@lume/utils";
import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import reactStringReplace from "react-string-replace";
import { User } from "../../user";
import { Hashtag } from "./hashtag";
import { MentionUser } from "./user";
import { useArk, useEvent } from "@lume/ark";
import { LinkIcon } from "@lume/icons";
import { stripHtml } from "string-strip-html";

export function MentionNote({
  eventId,
  openable = true,
}: {
  eventId: string;
  openable?: boolean;
}) {
  const { t } = useTranslation();
  const { isLoading, isError, data } = useEvent(eventId);

  const ark = useArk();
  const content = useMemo(() => {
    if (!data) return "";

    const text = stripHtml(data.content.trim()).result;
    const words = text.split(/( |\n)/);

    // @ts-ignore, kaboom !!!
    let parsedContent: ReactNode[] = text;

    const hashtags = words.filter((word) => word.startsWith("#"));
    const mentions = words.filter((word) =>
      NOSTR_MENTIONS.some((el) => word.startsWith(el)),
    );

    try {
      if (hashtags.length) {
        for (const hashtag of hashtags) {
          parsedContent = reactStringReplace(
            parsedContent,
            hashtag,
            (match, i) => {
              return <Hashtag key={match + i} tag={hashtag} />;
            },
          );
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
              className="content-break inline-block w-full truncate font-normal text-blue-500 hover:text-blue-600"
            >
              {url.toString()}
            </a>
          );
        },
      );

      return parsedContent;
    } catch (e) {
      return text;
    }
  }, [data]);

  if (isLoading) {
    return (
      <div
        contentEditable={false}
        className="my-1 flex w-full cursor-default items-center justify-between rounded-2xl border border-black/10 p-3 dark:border-white/10"
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div
        contentEditable={false}
        className="my-1 w-full cursor-default rounded-2xl border border-black/10 p-3 dark:border-white/10"
      >
        {t("note.error")}
      </div>
    );
  }

  return (
    <div className="my-1 flex w-full cursor-default flex-col rounded-xl border border-black/10 px-3 pt-1 dark:border-white/10">
      <User.Provider pubkey={data.pubkey}>
        <User.Root className="flex h-10 items-center gap-2">
          <User.Avatar className="size-6 shrink-0 rounded-full object-cover" />
          <div className="inline-flex flex-1 items-center gap-2">
            <User.Name className="font-semibold text-neutral-900 dark:text-neutral-100" />
            <span className="text-neutral-600 dark:text-neutral-400">·</span>
            <User.Time
              time={data.created_at}
              className="text-neutral-600 dark:text-neutral-400"
            />
          </div>
        </User.Root>
      </User.Provider>
      <div className="line-clamp-4 select-text whitespace-normal text-balance leading-normal">
        {content}
      </div>
      {openable ? (
        <div className="flex h-10 items-center justify-between">
          <button
            type="button"
            onClick={() => ark.open_thread(data.id)}
            className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-blue-500 dark:text-neutral-400"
          >
            {t("note.showMore")}
            <LinkIcon className="size-4" />
          </button>
        </div>
      ) : (
        <div className="h-3" />
      )}
    </div>
  );
}
