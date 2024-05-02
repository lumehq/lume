import type { Event } from "@lume/types";
import { cn } from "@lume/utils";
import { Note } from "..";

export function TextNote({
	event,
	className,
}: {
	event: Event;
	className?: string;
}) {
	return (
		<Note.Provider event={event}>
			<Note.Root
				className={cn(
					"mb-3 flex flex-col gap-2 border-b border-neutral-100 pb-3 dark:border-neutral-900",
					className,
				)}
			>
				<div className="flex items-start justify-between">
					<Note.User className="flex-1 pr-2" />
					<Note.Menu />
				</div>
				<div className="flex gap-3">
					<div className="size-11 shrink-0" />
					<div className="min-w-0 flex-1">
						<Note.Thread className="mb-2" />
						<Note.Content />
						<div className="mt-5 flex items-center justify-between">
							<Note.Reaction />
							<div className="inline-flex items-center gap-4">
								<Note.Reply />
								<Note.Repost />
								<Note.Zap />
							</div>
						</div>
					</div>
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
