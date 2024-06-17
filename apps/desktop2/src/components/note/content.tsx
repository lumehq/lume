import { cn } from "@lume/utils";
import { type ReactNode, useMemo } from "react";
import reactStringReplace from "react-string-replace";
import { Hashtag } from "./mentions/hashtag";
import { MentionNote } from "./mentions/note";
import { MentionUser } from "./mentions/user";
import { Images } from "./preview/images";
import { Videos } from "./preview/videos";
import { useNoteContext } from "./provider";
import { nanoid } from "nanoid";

export function NoteContent({
	quote = true,
	mention = true,
	clean,
	className,
}: {
	quote?: boolean;
	mention?: boolean;
	clean?: boolean;
	className?: string;
}) {
	const event = useNoteContext();
	const content = useMemo(() => {
		try {
			// Get parsed meta
			const { content, hashtags, events, mentions } = event.meta;

			// Define rich content
			let richContent: ReactNode[] | string = content;

			for (const hashtag of hashtags) {
				const regex = new RegExp(`(|^)${hashtag}\\b`, "g");
				richContent = reactStringReplace(richContent, regex, (_, index) => {
					return <Hashtag key={hashtag + index} tag={hashtag} />;
				});
			}

			for (const event of events) {
				if (quote) {
					richContent = reactStringReplace(richContent, event, (_, index) => (
						<MentionNote key={event + index} eventId={event} />
					));
				}

				if (!quote && clean) {
					richContent = reactStringReplace(richContent, event, () => null);
				}
			}

			for (const user of mentions) {
				if (mention) {
					richContent = reactStringReplace(richContent, user, (_, index) => (
						<MentionUser key={user + index} pubkey={user} />
					));
				}

				if (!mention && clean) {
					richContent = reactStringReplace(richContent, user, () => null);
				}
			}

			richContent = reactStringReplace(
				richContent,
				/(https?:\/\/\S+)/gi,
				(match, index) => (
					<a
						key={match + index}
						href={match}
						target="_blank"
						rel="noreferrer"
						className="inline text-blue-500 hover:text-blue-600"
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
		<div className="flex flex-col gap-2">
			<div
				className={cn(
					"select-text text-pretty content-break overflow-hidden",
					event.content.length > 620 ? "max-h-[250px] gradient-mask-b-0" : "",
					className,
				)}
			>
				{content}
			</div>
			{event.meta?.images.length ? <Images urls={event.meta.images} /> : null}
			{event.meta?.videos.length ? <Videos urls={event.meta.videos} /> : null}
		</div>
	);
}
