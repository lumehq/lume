import { cn } from "@/commons";
import { settingsQueryOptions } from "@/routes/__root";
import { useSuspenseQuery } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { type ReactNode, useMemo, useState } from "react";
import reactStringReplace from "react-string-replace";
import { Hashtag } from "./mentions/hashtag";
import { MentionNote } from "./mentions/note";
import { MentionUser } from "./mentions/user";
import { Images } from "./preview/images";
import { useNoteContext } from "./provider";

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
	const settings = useSuspenseQuery(settingsQueryOptions);

	const content = useMemo(() => {
		try {
			// Get parsed meta
			const { content, hashtags, events, mentions } = event.meta;

			// Define rich content
			let richContent: ReactNode[] | string = settings.data.display_media
				? content
				: event.content;

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
		} catch {
			return event.content;
		}
	}, [event.content]);

	const [blurred, setBlurred] = useState(() =>
		event.warning ? event.warning.length > 0 : false,
	);

	return (
		<div className="relative flex flex-col gap-2">
			{!blurred ? (
				<>
					<div
						className={cn(
							"select-text text-pretty content-break overflow-hidden",
							className,
						)}
					>
						{content}
					</div>
					{settings.data.display_media ? (
						event.meta?.images.length ? (
							<Images urls={event.meta.images} />
						) : null
					) : null}
				</>
			) : (
				<div
					className={cn(
						"select-text text-pretty content-break overflow-hidden",
						className,
					)}
				>
					<p className="text-yellow-600 dark:text-yellow-400">
						The content is hidden because the author marked it with a warning
						for a reason: <span className="font-semibold">{event.warning}</span>
					</p>
					<button
						type="button"
						onClick={() => setBlurred(false)}
						className="font-medium text-sm text-blue-500 hover:text-blue-600"
					>
						View anyway
					</button>
				</div>
			)}
		</div>
	);
}
