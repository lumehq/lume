import { cn } from "@lume/utils";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { Note } from "..";

export function TextNote({
	event,
	className,
}: { event: NDKEvent; className?: string }) {
	return (
		<Note.Provider event={event}>
			<Note.Root
				className={cn(
					"flex flex-col rounded-xl bg-neutral-50 dark:bg-neutral-950",
					className,
				)}
			>
				<div className="flex items-center justify-between px-3 h-14">
					<Note.User className="flex-1 pr-1" />
					<Note.Menu />
				</div>
				<Note.Thread className="mb-2" />
				<Note.Content className="min-w-0 px-3" />
				<div className="flex items-center justify-between px-3 h-14">
					<Note.Pin />
					<div className="inline-flex items-center gap-4">
						<Note.Reply />
						<Note.Repost />
						<Note.Zap />
					</div>
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
