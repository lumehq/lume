import { ArrowRightIcon } from "@lume/icons";
import type { Event } from "@lume/types";
import { Note, User } from "@lume/ui";
import { cn } from "@lume/utils";
import { useRouteContext } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function Conversation({
	event,
	className,
}: {
	event: Event;
	className?: string;
}) {
	const { t } = useTranslation();
	const { ark } = useRouteContext({ strict: false });
	const thread = ark.parse_event_thread({
		content: event.content,
		tags: event.tags,
	});

	return (
		<Note.Provider event={event}>
			<Note.Root
				className={cn(
					"bg-white dark:bg-black/20 backdrop-blur-lg rounded-xl mb-3 flex flex-col gap-3 shadow-primary dark:ring-1 ring-neutral-800/50",
					className,
				)}
			>
				<div className="px-3 pt-3">
					<h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
						Thread
					</h3>
				</div>
				<div className="flex flex-col gap-3 px-3">
					{thread?.rootEventId ? (
						<Note.Child eventId={thread?.rootEventId} isRoot />
					) : null}
					{thread?.replyEventId ? (
						<Note.Child eventId={thread?.replyEventId} />
					) : null}
				</div>
				<div className="relative flex gap-3 px-3">
					<User.Provider pubkey={event.pubkey}>
						<User.Root>
							<User.Avatar className="size-10 shrink-0 rounded-full object-cover" />
							<div className="z-10 absolute left-[66px] top-2">
								<User.Name className="inline font-semibold" />{" "}
								<span className="inline font-normal text-neutral-700 dark:text-neutral-300">
									{t("note.replied")}
								</span>
							</div>
						</User.Root>
					</User.Provider>
					<div className="relative flex-1 rounded-xl bg-neutral-100 p-3 dark:bg-white/10">
						<div className="absolute left-0 top-[18px] h-3 w-3 -translate-y-1/2 -translate-x-1/2 rotate-45 transform bg-neutral-100 dark:bg-transparent" />
						<div className="content-break mt-5 line-clamp-3 select-text leading-normal text-neutral-900 dark:text-neutral-100">
							{event.content}
						</div>
					</div>
				</div>
				<div>
					<button
						type="button"
						onClick={() =>
							ark.open_thread(
								thread?.rootEventId || thread?.replyEventId || event.id,
							)
						}
						className="px-3 w-full text-sm font-medium gap-1.5 h-9 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-b-xl flex items-center justify-end border-t border-neutral-100 dark:border-neutral-900"
					>
						View thread
						<ArrowRightIcon className="size-4" />
					</button>
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
