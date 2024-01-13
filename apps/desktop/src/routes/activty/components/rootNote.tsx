import { Note, useEvent } from "@lume/ark";

export function ActivityRootNote({ eventId }: { eventId: string }) {
	const { isLoading, isError, data } = useEvent(eventId);

	if (isLoading) {
		return (
			<div className="relative flex gap-3">
				<div className="relative flex-1 rounded-md bg-neutral-200 px-2 py-2 dark:bg-neutral-800">
					<div className="h-4 w-full animate-pulse bg-neutral-300 dark:bg-neutral-700" />
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="relative flex gap-3">
				<div className="relative flex-1 rounded-md bg-neutral-200 px-2 py-2 dark:bg-neutral-800">
					Failed to fetch event
				</div>
			</div>
		);
	}

	return (
		<Note.Provider event={data}>
			<Note.Root>
				<div className="flex items-center justify-between px-3 h-14">
					<Note.User className="flex-1 pr-1" />
				</div>
				<Note.Content className="min-w-0 px-3" />
				<div className="flex items-center justify-between px-3 h-14">
					<Note.Pin />
					<div className="inline-flex items-center gap-10" />
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
