import { Kind, Settings } from "@lume/types";
import {
  AUDIOS,
  IMAGES,
  NOSTR_EVENTS,
  NOSTR_MENTIONS,
  VIDEOS,
  cn,
} from "@lume/utils";
import { useNoteContext } from "./provider";
import { ReactNode, useMemo } from "react";
import { nanoid } from "nanoid";
import { MentionUser } from "./mentions/user";
import { MentionNote } from "./mentions/note";
import { Hashtag } from "./mentions/hashtag";
import { VideoPreview } from "./preview/video";
import { ImagePreview } from "./preview/image";
import reactStringReplace from "react-string-replace";
import { useRouteContext } from "@tanstack/react-router";

export function NoteContent({ className }: { className?: string }) {
  const { settings }: { settings: Settings } = useRouteContext({
    strict: false,
  });
  const event = useNoteContext();
  const content = useMemo(() => {
    const text = event.content.trim();
    const words = text.split(/( |\n)/);
    const hashtags = words.filter((word) => word.startsWith("#"));
    const events = words.filter((word) =>
      NOSTR_EVENTS.some((el) => word.startsWith(el)),
    );
    const mentions = words.filter((word) =>
      NOSTR_MENTIONS.some((el) => word.startsWith(el)),
    );

    let parsedContent: ReactNode[] | string = text;

    try {
      if (hashtags.length) {
        for (const hashtag of hashtags) {
          const regex = new RegExp(`(|^)${hashtag}\\b`, "g");
          parsedContent = reactStringReplace(parsedContent, regex, () => {
            return <Hashtag key={nanoid()} tag={hashtag} />;
          });
        }
      }

      if (events.length) {
        for (const event of events) {
          parsedContent = reactStringReplace(
            parsedContent,
            event,
            (match, i) => <MentionNote key={match + i} eventId={event} />,
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
        /(https?:\/\/\S+)/gi,
        (match, i) => {
          try {
            const url = new URL(match);
            const ext = url.pathname.split(".")[1];

            if (!settings.enhancedPrivacy) {
              if (IMAGES.includes(ext)) {
                return <ImagePreview key={match + i} url={url.toString()} />;
              }

              if (VIDEOS.includes(ext)) {
                return <VideoPreview key={match + i} url={url.toString()} />;
              }

              if (AUDIOS.includes(ext)) {
                return <VideoPreview key={match + i} url={url.toString()} />;
              }
            }

            return (
              <a
                key={match + i}
                href={match}
                target="_blank"
                rel="noreferrer"
                className="content-break w-full font-normal text-blue-500 hover:text-blue-600"
              >
                {match}
              </a>
            );
          } catch {
            return (
              <a
                key={match + i}
                href={match}
                target="_blank"
                rel="noreferrer"
                className="content-break w-full font-normal text-blue-500 hover:text-blue-600"
              >
                {match}
              </a>
            );
          }
        },
      );

      return parsedContent;
    } catch (e) {
      return text;
    }
  }, []);

  return (
    <div className={cn("select-text", className)}>
      <div className="content-break whitespace-pre-line text-balance leading-normal">
        {content}
      </div>
    </div>
  );
}
