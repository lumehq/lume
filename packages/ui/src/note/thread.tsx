import { LinkIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { useRouteContext } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Note } from ".";
import { useNoteContext } from "./provider";

export function NoteThread({ className }: { className?: string }) {
	const { ark } = useRouteContext({ strict: false });
	const event = useNoteContext();
	const thread = ark.parse_event_thread({
		content: event.content,
		tags: event.tags,
	});

	const { t } = useTranslation();

	if (!thread) return null;

	return (
		<div className={cn("w-full", className)}>
			<div className="flex h-min w-full flex-col gap-3 rounded-2xl border border-black/10 p-3 dark:border-white/10">
				{thread.rootEventId ? (
					<Note.Child eventId={thread.rootEventId} isRoot />
				) : null}
				{thread.replyEventId ? (
					<Note.Child eventId={thread.replyEventId} />
				) : null}
				<div className="inline-flex justify-end">
					<button
						type="button"
						onClick={() =>
							ark.open_thread(thread.rootEventId || thread.replyEventId)
						}
						className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-blue-500 dark:text-neutral-400"
					>
						{t("note.showThread")}
						<LinkIcon className="size-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
