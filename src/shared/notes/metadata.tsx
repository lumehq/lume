import { createReplyNote } from "@libs/storage";
import { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
import { LoaderIcon, ReplyIcon, RepostIcon, ZapIcon } from "@shared/icons";
import { NoteReply } from "@shared/notes/metadata/reply";
import { NoteRepost } from "@shared/notes/metadata/repost";
import { NoteZap } from "@shared/notes/metadata/zap";
import { RelayContext } from "@shared/relayProvider";
import { useQuery } from "@tanstack/react-query";
import { decode } from "light-bolt11-decoder";
import { useContext } from "react";

export function NoteMetadata({
	id,
	eventPubkey,
	currentBlock,
}: {
	id: string;
	eventPubkey: string;
	currentBlock?: number;
}) {
	const ndk = useContext(RelayContext);
	const { status, data, isFetching } = useQuery(
		["note-metadata", id],
		async () => {
			let replies = 0;
			let reposts = 0;
			let zap = 0;

			const filter: NDKFilter = {
				"#e": [id],
				kinds: [1, 6, 9735],
			};

			const events = await ndk.fetchEvents(filter);
			events.forEach((event: NDKEvent) => {
				switch (event.kind) {
					case 1:
						replies += 1;
						createReplyNote(
							id,
							event.id,
							event.pubkey,
							event.kind,
							event.tags,
							event.content,
							event.created_at,
						);
						break;
					case 6:
						reposts += 1;
						break;
					case 9735: {
						const bolt11 = event.tags.find((tag) => tag[0] === "bolt11")[1];
						if (bolt11) {
							const decoded = decode(bolt11);
							const amount = decoded.sections.find(
								(item) => item.name === "amount",
							);
							const sats = amount.value / 1000;
							zap += sats;
						}
						break;
					}
					default:
						break;
				}
			});

			return { replies, reposts, zap };
		},
	);

	return (
		<div className="inline-flex items-center w-full h-12 mt-2">
			{status === "loading" || isFetching ? (
				<>
					<div className="w-20 group inline-flex items-center gap-1.5">
						<ReplyIcon
							width={16}
							height={16}
							className="text-zinc-400 group-hover:text-green-400"
						/>
						<LoaderIcon
							width={12}
							height={12}
							className="animate-spin text-black dark:text-zinc-100"
						/>
					</div>
					<div className="w-20 group inline-flex items-center gap-1.5">
						<RepostIcon
							width={16}
							height={16}
							className="text-zinc-400 group-hover:text-green-400"
						/>
						<LoaderIcon
							width={12}
							height={12}
							className="animate-spin text-black dark:text-zinc-100"
						/>
					</div>
					<div className="w-20 group inline-flex items-center gap-1.5">
						<ZapIcon
							width={16}
							height={16}
							className="text-zinc-400 group-hover:text-green-400"
						/>
						<LoaderIcon
							width={12}
							height={12}
							className="animate-spin text-black dark:text-zinc-100"
						/>
					</div>
				</>
			) : (
				<>
					<NoteReply
						id={id}
						replies={data.replies}
						currentBlock={currentBlock}
					/>
					<NoteRepost id={id} pubkey={eventPubkey} reposts={data.reposts} />
					<NoteZap zaps={data.zap} />
				</>
			)}
		</div>
	);
}
