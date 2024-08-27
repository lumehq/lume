import { cn } from "@/commons";
import { useEvent } from "@/system";
import type { EventTag } from "@/types";
import { Info } from "@phosphor-icons/react";
import { Note } from ".";

export function NoteChild({
	event,
	isRoot,
}: {
	event: EventTag;
	isRoot?: boolean;
}) {
	const { isLoading, isError, data } = useEvent(event.id);

	if (isLoading) {
		return (
			<div className="flex items-center gap-2 px-3 pt-3">
				<div className="rounded-full size-8 shrink-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
				<div className="w-2/3 h-4 rounded-md animate-pulse bg-neutral-200 dark:bg-neutral-800" />
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="flex items-center gap-2 px-3 pt-3">
				<div className="inline-flex items-center justify-center text-white bg-red-500 rounded-full size-8 shrink-0">
					<Info className="size-5" />
				</div>
				<p className="text-sm text-red-500">
					Event not found with your current relay set
				</p>
			</div>
		);
	}

	return (
		<Note.Provider event={data}>
			<Note.Root className={cn(isRoot ? "mb-3" : "")}>
				<div className="flex items-center justify-between px-3 h-14">
					<Note.User />
				</div>
				<Note.Content className="px-3" />
			</Note.Root>
		</Note.Provider>
	);
}
