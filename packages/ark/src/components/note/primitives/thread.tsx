import { Note } from "..";
import { useEvent } from "../../../hooks/useEvent";

export function ThreadNote({ eventId }: { eventId: string }) {
	const { isLoading, data } = useEvent(eventId);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<Note.Provider event={data}>
			<Note.Root>
				<div className="flex items-center justify-between px-3 h-14">
					<Note.User className="flex-1 pr-1" />
					<Note.Menu />
				</div>
				<Note.Thread className="mb-2" />
				<Note.Content className="min-w-0 px-3" isTranslatable />
				<div className="flex items-center justify-between px-3 h-14">
					<Note.Pin />
					<div className="inline-flex items-center gap-10">
						<Note.Reply />
						<Note.Repost />
						<Note.Zap />
					</div>
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
