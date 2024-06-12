import { cn } from "@lume/utils";
import { nanoid } from "nanoid";
import { type ReactNode, useMemo } from "react";
import reactStringReplace from "react-string-replace";
import { Hashtag } from "./mentions/hashtag";
import { MentionNote } from "./mentions/note";
import { MentionUser } from "./mentions/user";
import { ImagePreview } from "./preview/image";
import { VideoPreview } from "./preview/video";
import { useNoteContext } from "./provider";

export function NoteContentLarge({
	className,
}: {
	className?: string;
}) {
	const event = useNoteContext();
	const content = useMemo(() => {
		try {
			// Get parsed meta
			const { images, videos, hashtags, events, mentions } = event.meta;

			// Define rich content
			let richContent: ReactNode[] | string = event.content;

			for (const hashtag of hashtags) {
				const regex = new RegExp(`(|^)${hashtag}\\b`, "g");
				richContent = reactStringReplace(richContent, regex, () => (
					<Hashtag key={nanoid()} tag={hashtag} />
				));
			}

			for (const event of events) {
				richContent = reactStringReplace(richContent, event, (match, i) => (
					<MentionNote key={match + i} eventId={event} />
				));
			}

			for (const mention of mentions) {
				richContent = reactStringReplace(richContent, mention, (match, i) => (
					<MentionUser key={match + i} pubkey={mention} />
				));
			}

			for (const image of images) {
				richContent = reactStringReplace(richContent, image, (match, i) => (
					<ImagePreview key={match + i} url={match} />
				));
			}

			for (const video of videos) {
				richContent = reactStringReplace(richContent, video, (match, i) => (
					<VideoPreview key={match + i} url={match} />
				));
			}

			richContent = reactStringReplace(
				richContent,
				/(https?:\/\/\S+)/gi,
				(match, i) => (
					<a
						key={match + i}
						href={match}
						target="_blank"
						rel="noreferrer"
						className="text-blue-500 line-clamp-1 hover:text-blue-600"
					>
						{match}
					</a>
				),
			);

			richContent = reactStringReplace(richContent, /(\r\n|\r|\n)+/g, () => (
				<div key={nanoid()} className="h-3" />
			));

			return richContent;
		} catch (e) {
			console.log("[parser]: ", e);
			return event.content;
		}
	}, [event.content]);

	return (
		<div
			className={cn(
				"select-text leading-normal text-pretty content-break",
				className,
			)}
		>
			{content}
		</div>
	);
}
