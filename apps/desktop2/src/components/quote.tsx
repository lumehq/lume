import { useEvent } from "@lume/ark";
import { ArrowRightIcon } from "@lume/icons";
import type { Event } from "@lume/types";
import { Note, User } from "@lume/ui";
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
					<Note.Content quote={false} clean />
				</div>
				<div className="px-3">
					<QuoteNote eventId={quoteEventId} />
				</div>
				<div>
					<button
						type="button"
						onClick={() => ark.open_thread(quoteEventId ?? event.id)}
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

function QuoteNote({
	eventId,
}: {
	eventId: string;
}) {
	const { isLoading, isError, data } = useEvent(eventId);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !data) {
		return <div>Error</div>;
	}

	return (
		<Note.Provider event={data}>
			<Note.Root className="w-full flex flex-col p-3 rounded-lg border border-neutral-100 dark:border-neutral-900 shadow-inner shadow-neutral-300/10 dark:shadow-neutrl-700/10">
				<User.Provider pubkey={data.pubkey}>
					<User.Root className="flex h-10 items-center gap-2">
						<User.Avatar className="size-6 shrink-0 rounded-full object-cover" />
						<div className="inline-flex flex-1 items-center gap-2">
							<User.Name className="font-semibold text-neutral-900 dark:text-neutral-100" />
							<span className="text-neutral-600 dark:text-neutral-400">·</span>
							<User.Time
								time={data.created_at}
								className="text-neutral-600 dark:text-neutral-400"
							/>
						</div>
					</User.Root>
				</User.Provider>
				<Note.Content quote={false} />
			</Note.Root>
		</Note.Provider>
	);
}
