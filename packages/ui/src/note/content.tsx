import { Kind } from "@lume/types";
import {
  AUDIOS,
  IMAGES,
  NOSTR_EVENTS,
  NOSTR_MENTIONS,
  VIDEOS,
  canPreview,
  cn,
} from "@lume/utils";
import getUrls from "get-urls";
import { nanoid } from "nanoid";
import { ReactNode, useMemo } from "react";
import reactStringReplace from "react-string-replace";
import { stripHtml } from "string-strip-html";
import { Hashtag } from "./mentions/hashtag";
import { MentionNote } from "./mentions/note";
import { MentionUser } from "./mentions/user";
import { NIP89 } from "./nip89";
import { ImagePreview } from "./preview/image";
import { LinkPreview } from "./preview/link";
import { VideoPreview } from "./preview/video";
import { useNoteContext } from "./provider";

export function NoteContent({ className }: { className?: string }) {
  const event = useNoteContext();

  const richContent = useMemo(() => {
    if (event.kind !== Kind.Text) return event.content;

    let parsedContent: string | ReactNode[] = stripHtml(event.content).result;
    let linkPreview: string = undefined;
    let images: string[] = [];
    let videos: string[] = [];
    let audios: string[] = [];
    let events: string[] = [];

    const text = parsedContent;
    const words = text.split(/( |\n)/);
    const urls = [...getUrls(text)];

    images = urls.filter((word) =>
      IMAGES.some((el) => {
        const url = new URL(word);
        const extension = url.pathname.split(".")[1];
        if (extension === el) return true;
        return false;
      }),
    );

    videos = urls.filter((word) =>
      VIDEOS.some((el) => {
        const url = new URL(word);
        const extension = url.pathname.split(".")[1];
        if (extension === el) return true;
        return false;
      }),
    );

    audios = urls.filter((word) =>
      AUDIOS.some((el) => {
        const url = new URL(word);
        const extension = url.pathname.split(".")[1];
        if (extension === el) return true;
        return false;
      }),
    );

    events = words.filter((word) =>
      NOSTR_EVENTS.some((el) => word.startsWith(el)),
    );

    const hashtags = words.filter((word) => word.startsWith("#"));
    const mentions = words.filter((word) =>
      NOSTR_MENTIONS.some((el) => word.startsWith(el)),
    );

    try {
      if (images.length) {
        for (const image of images) {
          parsedContent = reactStringReplace(
            parsedContent,
            image,
            (match, i) => <ImagePreview key={match + i} url={match} />,
          );
        }
      }

      if (videos.length) {
        for (const video of videos) {
          parsedContent = reactStringReplace(
            parsedContent,
            video,
            (match, i) => <VideoPreview key={match + i} url={match} />,
          );
        }
      }

      if (audios.length) {
        for (const audio of audios) {
          parsedContent = reactStringReplace(
            parsedContent,
            audio,
            (match, i) => <VideoPreview key={match + i} url={match} />,
          );
        }
      }

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
        /(https?:\/\/\S+)/g,
        (match, i) => {
          const url = new URL(match);

          if (!linkPreview && canPreview(match)) {
            linkPreview = match;
            return <LinkPreview key={match + i} url={url.toString()} />;
          }

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

      parsedContent = reactStringReplace(parsedContent, "\n", () => {
        return <br key={nanoid()} />;
      });

      if (typeof parsedContent[0] === "string") {
        parsedContent[0] = parsedContent[0].trimStart();
      }

      return parsedContent;
    } catch (e) {
      console.warn(event.id, `[parser] parse failed: ${e}`);
      return parsedContent;
    }
  }, []);

  if (event.kind !== Kind.Text) {
    return <NIP89 className={className} />;
  }

  return (
    <div className={cn(className)}>
      <div className="content-break select-text whitespace-pre-line text-balance leading-normal">
        {richContent}
      </div>
    </div>
  );
}
