import type { EventWithReplies } from "@lume/types";
import { cn } from "@lume/utils";
import { Note, User } from "@lume/ui";
import { SubReply } from "./subReply";

export function Reply({ event }: { event: EventWithReplies }) {
	return (
		<Note.Provider event={event}>
			<Note.Root className="border-t border-neutral-100 pt-3 dark:border-neutral-900">
				<User.Provider pubkey={event.pubkey}>
					<User.Root className="mb-2 flex items-center justify-between">
						<div className="inline-flex gap-2">
							<User.Avatar className="size-6 rounded-full" />
							<div className="inline-flex items-center gap-2">
								<User.Name className="font-semibold" />
								<User.NIP05 />
							</div>
						</div>
						<User.Time time={event.created_at} />
					</User.Root>
				</User.Provider>
				<Note.Content />
				<div className="mt-4 flex items-center justify-between">
					<div className="-ml-1 inline-flex items-center gap-4">
						<Note.Reply />
						<Note.Repost />
						<Note.Zap />
					</div>
					<Note.Menu />
				</div>
				<div
					className={cn(
						event.replies?.length > 0
							? "my-3 mt-6 flex flex-col gap-3 divide-y divide-neutral-100 border-l-2 border-neutral-100 pl-6 dark:divide-neutral-900 dark:border-neutral-900"
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
