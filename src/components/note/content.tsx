import { appSettings, cn } from "@/commons";
import { useStore } from "@tanstack/react-store";
import { nanoid } from "nanoid";
import { type ReactNode, memo, useMemo, useState } from "react";
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
	const visible = useStore(appSettings, (state) => state.display_media);
	const warning = useMemo(() => event.warning, [event]);
	const content = useMemo(() => {
		try {
			// Get parsed meta
			const { content, hashtags, events, mentions } = event.meta;

			// Define rich content
			let richContent: ReactNode[] | string = visible ? content : event.content;

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

	return (
		<div className="relative flex flex-col gap-2">
			<ContentWarning warning={warning} />
			<div
				className={cn(
					"select-text text-pretty content-break overflow-hidden",
					event.content.length > 500 ? "max-h-[250px] gradient-mask-b-0" : "",
					className,
				)}
			>
				{content}
			</div>
			{visible ? (
				event.meta?.images.length ? (
					<Images urls={event.meta.images} />
				) : null
			) : null}
		</div>
	);
}

const ContentWarning = memo(function ContentWarning({
	warning,
}: { warning: string }) {
	const [blurred, setBlurred] = useState(() => warning?.length > 0);

	if (!blurred) return null;

	return (
		<div className="absolute inset-0 z-10 flex items-center justify-center w-full h-full bg-black/80 backdrop-blur-lg">
			<div className="flex flex-col items-center justify-center gap-2 text-center">
				<p className="text-sm text-white/60">
					The content is hidden because the author
					<br />
					marked it with a warning for a reason:
				</p>
				<p className="text-sm font-medium text-white">{warning}</p>
				<button
					type="button"
					onClick={() => setBlurred(false)}
					className="inline-flex items-center justify-center px-2 mt-4 text-sm font-medium border rounded-lg text-white/70 h-9 w-max bg-white/20 hover:bg-white/30 border-white/5"
				>
					View anyway
				</button>
			</div>
		</div>
	);
});
