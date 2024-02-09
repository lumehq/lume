import { PinIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Note } from ".";
import { useArk } from "../../provider";
import { useNoteContext } from "./provider";

export function NoteThread({
	className,
}: {
	className?: string;
}) {
	const ark = useArk();
	const event = useNoteContext();
	const thread = ark.parse_event_thread({
		content: event.content,
		tags: event.tags,
	});

	const { t } = useTranslation();

	if (!thread) return null;

	return (
		<div className={cn("w-full px-3", className)}>
			<div className="flex flex-col w-full gap-3 p-3 rounded-lg h-min bg-neutral-100 dark:bg-neutral-900">
				{thread.rootEventId ? (
					<Note.Child eventId={thread.rootEventId} isRoot />
				) : null}
				{thread.replyEventId ? (
					<Note.Child eventId={thread.replyEventId} />
				) : null}
				<div className="inline-flex items-center justify-between">
					<Link
						to={`/events/${thread?.rootEventId || thread?.replyEventId}`}
						className="self-start text-blue-500 hover:text-blue-600"
					>
						{t("note.showThread")}
					</Link>
					<button
						type="button"
						className="inline-flex items-center justify-center rounded-md text-neutral-600 dark:text-neutral-400 size-6 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
					>
						<PinIcon className="size-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
