import type { Event } from "@lume/types";
import { Note } from "@lume/ui";
import { cn } from "@lume/utils";

export function Notification({
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
					"bg-white dark:bg-black/20 backdrop-blur-lg rounded-xl flex flex-col gap-3 shadow-primary dark:ring-1 ring-neutral-800/50",
					className,
				)}
			>
				<div className="flex flex-col gap-3">
					<div>
						<div className="px-3 h-14 flex items-center justify-between">
							<Note.User />
						</div>
						<Note.Content className="px-3" />
					</div>
				</div>
				<div className="flex items-center h-14 px-3">
					<Note.Open />
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
