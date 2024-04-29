import type { Event } from "@lume/types";
import { Note } from "@lume/ui";
import { cn } from "@lume/utils";
import { useRouteContext } from "@tanstack/react-router";

export function TextNote({
	event,
	className,
}: {
	event: Event;
	className?: string;
}) {
	const { settings } = useRouteContext({ strict: false });

	return (
		<Note.Provider event={event}>
			<Note.Root
				className={cn(
					"bg-white dark:bg-black/20 backdrop-blur-lg rounded-xl mb-3 shadow-primary dark:ring-1 ring-neutral-800/50",
					className,
				)}
			>
				<Note.User className="px-3 h-14 flex items-center" />
				<div className="flex flex-col gap-2">
					<Note.Content className="px-3" />
					<Note.Thread className="px-3" />
					<div className="h-11 px-3 flex items-center justify-between">
						<div className="inline-flex items-center gap-4">
							<Note.Reply />
							<Note.Repost />
							{settings.zap ? <Note.Zap /> : null}
						</div>
						<Note.Menu />
					</div>
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
