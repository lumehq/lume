import { LinkIcon } from "@lume/icons";
import type { Event } from "@lume/types";
import { Note } from "@lume/ui";
import { cn } from "@lume/utils";
import { useRouteContext } from "@tanstack/react-router";

export function Quote({
	event,
	className,
}: {
	event: Event;
	className?: string;
}) {
	const { ark } = useRouteContext({ strict: false });

	const quoteEventId = event.tags.find(
		(tag) => tag[0] === "q" || tag[3] === "mention",
	)?.[1];

	return (
		<Note.Provider event={event}>
			<Note.Root
				className={cn(
					"bg-white dark:bg-black/20 backdrop-blur-lg rounded-xl mb-3 flex flex-col gap-3 shadow-primary dark:ring-1 ring-neutral-800/50",
					className,
				)}
			>
				<div className="px-3 pt-3">
					<Note.User
						className="mb-3"
						suffix={
							<span className="ml-1.5 h-5 px-2 text-xs text-blue-500 rounded-full bg-blue-100 dark:bg-blue-900 border border-blue-500">
								Quote
							</span>
						}
					/>
					<Note.Content quote={true} />
				</div>
				<div className="flex flex-col gap-3 px-3">
					<Note.Child eventId={quoteEventId} isRoot />
				</div>
				<div>
					<button
						type="button"
						onClick={() => ark.open_thread(quoteEventId)}
						className="w-full text-sm font-medium gap-1.5 h-9 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-b-xl flex items-center justify-center border-t border-neutral-100 dark:border-neutral-900"
					>
						<LinkIcon className="size-4" />
						View thread
					</button>
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
