import { cn, parser } from "@lume/utils";
import { type ReactNode, useMemo, useState, useEffect } from "react";
import reactStringReplace from "react-string-replace";
import { Hashtag } from "./mentions/hashtag";
import { MentionNote } from "./mentions/note";
import { MentionUser } from "./mentions/user";
import { Images } from "./preview/images";
import { Videos } from "./preview/videos";
import { useNoteContext } from "./provider";
import { nanoid } from "nanoid";
import { Meta } from "@lume/types";

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
	const [meta, setMeta] = useState<Meta>(null);

	const event = useNoteContext();
	const content = useMemo(() => {
		try {
			if (!meta) return event.content;

			const { content, hashtags, events, mentions } = meta;
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
						className="line-clamp-1 text-blue-500 hover:text-blue-600"
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
			return meta.content;
		}
	}, [meta]);

	useEffect(() => {
		const abortController = new AbortController();
		let mounted = true;

		(async () => {
			const data = await parser(event.content, abortController);
			if (mounted) setMeta(data);
		})();

		return () => {
			mounted = false;
			abortController.abort();
		};
	}, [event.content]);

	return (
		<div className="flex flex-col gap-2">
			<div
				className={cn(
					"select-text text-pretty content-break overflow-hidden",
					event.content.length > 420 ? "max-h-[250px] gradient-mask-b-0" : "",
					className,
				)}
			>
				{content}
			</div>
			{meta?.images.length ? <Images urls={meta.images} /> : null}
			{meta?.videos.length ? <Videos urls={meta.images} /> : null}
		</div>
	);
}
