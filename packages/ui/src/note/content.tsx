import { NOSTR_EVENTS, NOSTR_MENTIONS, cn, parser } from "@lume/utils";
import { useNoteContext } from "./provider";
import { ReactNode, useMemo } from "react";
import { MentionUser } from "./mentions/user";
import { MentionNote } from "./mentions/note";
import { Hashtag } from "./mentions/hashtag";
import reactStringReplace from "react-string-replace";
import { Images } from "./preview/images";

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
	const data = useMemo(() => {
		const { content, images, videos } = parser(event.content);
		const words = content.split(/( |\n)/);
		const hashtags = words.filter((word) => word.startsWith("#"));
		const events = words.filter((word) =>
			NOSTR_EVENTS.some((el) => word.startsWith(el)),
		);
		const mentions = words.filter((word) =>
			NOSTR_MENTIONS.some((el) => word.startsWith(el)),
		);

		let richContent: ReactNode[] | string = content;

		try {
			if (hashtags.length) {
				for (const hashtag of hashtags) {
					const regex = new RegExp(`(|^)${hashtag}\\b`, "g");
					richContent = reactStringReplace(
						richContent,
						regex,
						(match, index) => {
							return <Hashtag key={match + index} tag={hashtag} />;
						},
					);
				}
			}

			if (events.length) {
				for (const event of events) {
					if (quote) {
						richContent = reactStringReplace(
							richContent,
							event,
							(match, index) => (
								<MentionNote key={match + index} eventId={event} />
							),
						);
					}

					if (!quote && clean) {
						richContent = reactStringReplace(richContent, event, () => null);
					}
				}
			}

			if (mentions.length) {
				for (const user of mentions) {
					if (mention) {
						richContent = reactStringReplace(
							richContent,
							user,
							(match, index) => (
								<MentionUser key={match + index} pubkey={user} />
							),
						);
					}

					if (!mention && clean) {
						richContent = reactStringReplace(richContent, user, () => null);
					}
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
						className="line-clamp-1 text-blue-500 hover:text-blue-600"
					>
						{match}
					</a>
				),
			);

			return { content: richContent, images, videos };
		} catch (e) {
			return { content, images, videos };
		}
	}, []);

	return (
		<div className={cn("select-text flex flex-col gap-2", className)}>
			<div className="content-break whitespace-pre-line text-balance leading-normal">
				{data.content}
			</div>
			{data.images.length ? <Images urls={data.images} /> : null}
		</div>
	);
}
