import { useEvent } from "@lume/ark";
import { cn } from "@lume/utils";
import { Note } from ".";
import { InfoIcon } from "@lume/icons";

export function NoteChild({
	eventId,
	isRoot,
}: {
	eventId: string;
	isRoot?: boolean;
}) {
	const { isLoading, isError, data } = useEvent(eventId);

	if (isLoading) {
		return (
			<div className="pt-3 px-3 flex items-center gap-2">
				<div className="size-8 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
				<div className="animate-pulse rounded-md h-4 w-2/3 bg-neutral-200 dark:bg-neutral-800" />
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="pt-3 px-3 flex items-center gap-2">
				<div className="size-8 shrink-0 rounded-full bg-red-500 text-white inline-flex items-center justify-center">
					<InfoIcon className="size-5" />
				</div>
				<p className="text-red-500 text-sm">
					Event not found with your current relay set
				</p>
			</div>
		);
	}

	return (
		<Note.Provider event={data}>
			<Note.Root className={cn(isRoot ? "mb-3" : "")}>
				<div className="h-14 px-3 flex items-center justify-between">
					<Note.User />
				</div>
				<Note.Content className="px-3" />
			</Note.Root>
		</Note.Provider>
	);
}
