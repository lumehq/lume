import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { Note } from ".";

export function NoteThread({
	thread,
	className,
}: {
	thread: { rootEventId: string; replyEventId: string };
	className?: string;
}) {
	if (!thread) return null;

	return (
		<div className={twMerge("w-full px-3", className)}>
			<div className="flex h-min w-full flex-col gap-3 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
				{thread.rootEventId ? (
					<Note.Child eventId={thread.rootEventId} isRoot />
				) : null}
				{thread.replyEventId ? (
					<Note.Child eventId={thread.replyEventId} />
				) : null}
				<Link
					to={`/events/${thread?.rootEventId || thread?.replyEventId}`}
					className="self-start text-blue-500 hover:text-blue-600"
				>
					Show full thread
				</Link>
			</div>
		</div>
	);
}
