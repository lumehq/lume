import { useEvent } from "@lume/ark";
import { cn } from "@lume/utils";
import { Note } from ".";

export function NoteChild({
	eventId,
	isRoot,
}: {
	eventId: string;
	isRoot?: boolean;
}) {
	const { isLoading, isError, data } = useEvent(eventId);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !data) {
		return <div>Error</div>;
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
