import type { Event } from "@lume/types";
import { Note, User } from "@lume/ui";

export function SubReply({ event }: { event: Event; rootEventId?: string }) {
	return (
		<Note.Provider event={event}>
			<Note.Root className="pt-3">
				<User.Provider pubkey={event.pubkey}>
					<User.Root className="mb-2 flex items-center justify-between">
						<div className="inline-flex gap-2">
							<User.Avatar className="size-6 rounded-full" />
							<div className="inline-flex items-center gap-2">
								<User.Name className="font-semibold" />
								<User.NIP05 className="text-base lowercase text-neutral-600 dark:text-neutral-400" />
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
			</Note.Root>
		</Note.Provider>
	);
}
