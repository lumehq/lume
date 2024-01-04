import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { Note } from "..";
import { useEvent } from "../../../hooks/useEvent";
import { useArk } from "../../../provider";

export function ThreadNote({ eventId }: { eventId: string }) {
	const ark = useArk();
	const { isLoading, data } = useEvent(eventId);

	const renderEventKind = (event: NDKEvent) => {
		const thread = ark.getEventThread({ tags: data.tags });
		switch (event.kind) {
			case NDKKind.Text:
				return (
					<>
						<Note.Thread thread={thread} className="mb-2" />
						<Note.Content className="min-w-0 px-3" />
					</>
				);
			default:
				return (
					<>
						<Note.Thread thread={thread} className="mb-2" />
						<Note.Content className="min-w-0 px-3" />
					</>
				);
		}
	};

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
				{renderEventKind(data)}
				<div className="flex items-center justify-between px-3 h-14">
					<Note.Pin />
					<div className="inline-flex items-center gap-10">
						<Note.Reply />
						<Note.Reaction />
						<Note.Repost />
						<Note.Zap />
					</div>
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
