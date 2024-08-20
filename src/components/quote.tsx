import { cn } from "@/commons";
import { Note } from "@/components/note";
import type { LumeEvent } from "@/system";
import { Quotes } from "@phosphor-icons/react";
import { memo } from "react";

export const Quote = memo(function Quote({
	event,
	className,
}: {
	event: LumeEvent;
	className?: string;
}) {
	return (
		<Note.Provider event={event}>
			<Note.Root
				className={cn(
					"bg-white dark:bg-black/20 rounded-xl flex flex-col gap-3 shadow-primary dark:ring-1 ring-neutral-800/50",
					className,
				)}
			>
				<div className="flex flex-col gap-3">
					<Note.Child event={event.quote} isRoot />
					<div className="flex items-center gap-2 px-3">
						<div className="inline-flex items-center gap-1.5 shrink-0 text-sm font-medium text-neutral-600 dark:text-neutral-400">
							<Quotes className="size-4" />
							Quote
						</div>
						<div className="flex-1 h-px bg-neutral-100 dark:bg-white/5" />
					</div>
					<div>
						<div className="flex items-center justify-between px-3 h-14">
							<Note.User />
						</div>
						<Note.Content className="px-3" quote={false} clean />
					</div>
				</div>
				<div className="flex items-center px-3 h-14">
					<Note.Open />
				</div>
			</Note.Root>
		</Note.Provider>
	);
});
