import { NoteReplyForm } from "@app/note/components/replies/form";
import { Reply } from "@app/note/components/replies/item";
import { NostrEvent } from "@nostr-dev-kit/ndk";
import { RelayContext } from "@shared/relayProvider";
import { sortEvents } from "@utils/transform";
import { useContext } from "react";
import useSWRSubscription from "swr/subscription";

export function RepliesList({ id }: { id: string }) {
	const ndk = useContext(RelayContext);

	const { data, error } = useSWRSubscription(
		id ? ["note-replies", id] : null,
		([, key], { next }) => {
			// subscribe to note
			const sub = ndk.subscribe(
				{
					"#e": [key],
					kinds: [1],
					limit: 20,
				},
				{
					closeOnEose: true,
				},
			);

			sub.addListener("event", (event: NostrEvent) => {
				next(null, (prev: any) => (prev ? [...prev, event] : [event]));
			});

			return () => {
				sub.stop();
			};
		},
	);

	return (
		<div className="mt-5">
			<div className="mb-2">
				<h5 className="text-lg font-semibold text-zinc-300">Replies</h5>
			</div>
			<div className="flex flex-col">
				<NoteReplyForm id={id} />
				{error && <div>failed to load</div>}
				{!data ? (
					<div className="flex gap-2 px-3 py-4">
						<div className="relative h-9 w-9 shrink animate-pulse rounded-md bg-zinc-800" />
						<div className="flex w-full flex-1 flex-col justify-center gap-1">
							<div className="flex items-baseline gap-2 text-base">
								<div className="h-2.5 w-20 animate-pulse rounded-sm bg-zinc-800" />
							</div>
							<div className="h-4 w-44 animate-pulse rounded-sm bg-zinc-800" />
						</div>
					</div>
				) : (
					sortEvents(data).map((event: any) => {
						return <Reply key={event.id} data={event} />;
					})
				)}
			</div>
		</div>
	);
}
