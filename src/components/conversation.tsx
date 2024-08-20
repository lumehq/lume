import { cn } from "@/commons";
import { Note } from "@/components/note";
import type { LumeEvent } from "@/system";
import { ChatsTeardrop } from "@phosphor-icons/react";
import { memo, useMemo } from "react";

export const Conversation = memo(function Conversation({
	event,
	className,
}: {
	event: LumeEvent;
	className?: string;
}) {
	const thread = useMemo(() => event.thread, [event]);

	return (
		<Note.Provider event={event}>
			<Note.Root
				className={cn(
					"bg-white dark:bg-black/20 rounded-xl flex flex-col gap-3 shadow-primary dark:ring-1 ring-neutral-800/50",
					className,
				)}
			>
				<div className="flex flex-col gap-3">
					{thread?.root?.id ? <Note.Child event={thread?.root} isRoot /> : null}
					<div className="flex items-center gap-2 px-3">
						<div className="inline-flex items-center gap-1.5 shrink-0 text-sm font-medium text-neutral-600 dark:text-neutral-400">
							<ChatsTeardrop className="size-4" />
							Thread
						</div>
						<div className="flex-1 h-px bg-neutral-100 dark:bg-white/5" />
					</div>
					{thread?.reply?.id ? <Note.Child event={thread?.reply} /> : null}
					<div>
						<div className="flex items-center justify-between px-3 h-14">
							<Note.User />
						</div>
						<Note.Content className="px-3" />
					</div>
				</div>
				<div className="flex items-center px-3 h-14">
					<Note.Open />
				</div>
			</Note.Root>
		</Note.Provider>
	);
});
