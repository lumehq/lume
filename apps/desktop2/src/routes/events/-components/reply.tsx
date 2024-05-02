import type { EventWithReplies } from "@lume/types";
import { Note, User } from "@lume/ui";
import { cn } from "@lume/utils";
import { SubReply } from "./subReply";

export function Reply({ event }: { event: EventWithReplies }) {
	return (
		<Note.Provider event={event}>
			<Note.Root className="border-t border-neutral-100 dark:border-neutral-900">
				<div className="px-3 h-14 flex items-center justify-between">
					<Note.User />
					<Note.Menu />
				</div>
				<Note.ContentLarge className="px-3" />
				<div className="mt-3 flex items-center gap-4 px-3">
					<Note.Reply />
					<Note.Repost />
					<Note.Zap />
				</div>
				<div
					className={cn(
						event.replies?.length > 0
							? "mt-3 py-2 pl-3 flex flex-col gap-3 divide-y divide-neutral-100 bg-neutral-50 dark:bg-white/5 border-l-2 border-blue-500 dark:divide-neutral-900"
							: "",
					)}
				>
					{event.replies?.length > 0
						? event.replies?.map((childEvent) => (
								<SubReply key={childEvent.id} event={childEvent} />
							))
						: null}
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
