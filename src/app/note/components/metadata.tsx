import NoteReply from "@app/note/components/metadata/reply";
import NoteRepost from "@app/note/components/metadata/repost";

import { RelayContext } from "@shared/relayProvider";

import NoteZap from "@app/note/components/metadata/zap";
import { READONLY_RELAYS } from "@stores/constants";
import { decode } from "light-bolt11-decoder";
import { useContext, useState } from "react";
import useSWRSubscription from "swr/subscription";

export default function NoteMetadata({
	id,
	eventPubkey,
}: { id: string; eventPubkey: string }) {
	const pool: any = useContext(RelayContext);

	const [replies, setReplies] = useState(0);
	const [reposts, setReposts] = useState(0);
	const [zaps, setZaps] = useState(0);

	useSWRSubscription(id ? ["note-metadata", id] : null, ([, key]) => {
		const unsubscribe = pool.subscribe(
			[
				{
					"#e": [key],
					since: 0,
					kinds: [1, 6, 9735],
					limit: 20,
				},
			],
			READONLY_RELAYS,
			(event: any) => {
				switch (event.kind) {
					case 1:
						setReplies((replies) => replies + 1);
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
			},
		);

		return () => {
			unsubscribe();
		};
	});

	return (
		<div className="mt-4 flex h-12 items-center gap-16 border-t border-zinc-800/50">
			<NoteReply id={id} replies={replies} />
			<NoteRepost id={id} pubkey={eventPubkey} reposts={reposts} />
			<NoteZap zaps={zaps} />
		</div>
	);
}
