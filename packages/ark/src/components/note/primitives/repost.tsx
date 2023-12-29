import { NDKEvent, NDKKind, NostrEvent } from "@nostr-dev-kit/ndk";
import { useQuery } from "@tanstack/react-query";
import { Note } from "..";
import { useArk } from "../../../provider";

export function RepostNote({
	event,
	className,
}: { event: NDKEvent; className?: string }) {
	const ark = useArk();

	const {
		isLoading,
		isError,
		data: repostEvent,
	} = useQuery({
		queryKey: ["repost", event.id],
		queryFn: async () => {
			try {
				if (event.content.length > 50) {
					const embed = JSON.parse(event.content) as NostrEvent;
					return new NDKEvent(ark.ndk, embed);
				}
				const id = event.tags.find((el) => el[0] === "e")[1];
				return await ark.getEventById({ id });
			} catch {
				throw new Error("Failed to get repost event");
			}
		},
		refetchOnWindowFocus: false,
	});

	const renderContentByKind = () => {
		if (!repostEvent) return null;
		switch (repostEvent.kind) {
			case NDKKind.Text:
				return <Note.TextContent content={repostEvent.content} />;
			case 1063:
				return <Note.MediaContent tags={repostEvent.tags} />;
			default:
				return null;
		}
	};

	if (isLoading) {
		return <div className="w-full px-3 pb-3">Loading...</div>;
	}

	if (isError || !repostEvent) {
		return (
			<Note.Root className={className}>
				<Note.Provider event={event}>
					<Note.User variant="repost" className="h-14" />
				</Note.Provider>
				<div className="select-text px-3 mb-3">
					<div className="bg-red-100 dark:bg-red-900 flex-col py-3 rounded-lg flex items-start justify-start px-3">
						<p className="text-red-500">Failed to get event</p>
						<p className="text-sm">
							You can consider enable Outbox in Settings for better event
							discovery.
						</p>
					</div>
				</div>
			</Note.Root>
		);
	}

	return (
		<Note.Root className={className}>
			<Note.Provider event={event}>
				<Note.User variant="repost" className="h-14" />
			</Note.Provider>
			<Note.Provider event={repostEvent}>
				<div className="relative flex flex-col gap-2 px-3">
					<Note.User />
					{renderContentByKind()}
					<div className="flex h-14 items-center justify-between">
						<Note.Pin />
						<div className="inline-flex items-center gap-10">
							<Note.Reply />
							<Note.Reaction />
							<Note.Repost />
							<Note.Zap />
						</div>
					</div>
				</div>
			</Note.Provider>
		</Note.Root>
	);
}
