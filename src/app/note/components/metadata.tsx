import { NoteReply } from "@app/note/components/metadata/reply";
import { NoteRepost } from "@app/note/components/metadata/repost";
import { NoteZap } from "@app/note/components/metadata/zap";
import { createReplyNote } from "@libs/storage";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { NDKSubscription } from "@nostr-dev-kit/ndk";
import { RelayContext } from "@shared/relayProvider";
import { decode } from "light-bolt11-decoder";
import { useContext, useState } from "react";
import useSWRSubscription from "swr/subscription";

export function NoteMetadata({
	id,
	eventPubkey,
}: {
	id: string;
	eventPubkey: string;
}) {
	const ndk = useContext(RelayContext);

	const [replies, setReplies] = useState(0);
	const [reposts, setReposts] = useState(0);
	const [zaps, setZaps] = useState(0);

	useSWRSubscription(id ? ["note-metadata", id] : null, () => {
		const sub: NDKSubscription = ndk.subscribe(
			{
				"#e": [id],
				kinds: [1, 6, 9735],
				limit: 20,
			},
			{ closeOnEose: false },
		);

		sub.addListener("event", (event: NDKEvent) => {
			switch (event.kind) {
				case 1:
					setReplies((replies) => replies + 1);
					createReplyNote(
						event.id,
						event.pubkey,
						event.kind,
						event.tags,
						event.content,
						event.created_at,
						id,
					);
					break;
				case 6:
					setReposts((reposts) => reposts + 1);
					break;
				case 9735: {
					const bolt11 = event.tags.find((tag) => tag[0] === "bolt11")[1];
					if (bolt11) {
						const decoded = decode(bolt11);
						const amount = decoded.sections.find(
							(item) => item.name === "amount",
						);
						setZaps(amount.value / 1000);
					}
					break;
				}
				default:
					break;
			}
		});

		return () => {
			sub.stop();
		};
	});

	return (
		<div className="inline-flex items-center gap-2 w-full h-12 mt-4">
			<NoteReply id={id} replies={replies} />
			<NoteRepost id={id} pubkey={eventPubkey} reposts={reposts} />
			<div className="ml-auto">
				<NoteZap zaps={zaps} />
			</div>
		</div>
	);
}
