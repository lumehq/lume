import { NoteReply } from "@app/space/components/notes/metadata/reply";
import { NoteRepost } from "@app/space/components/notes/metadata/repost";
import { NoteZap } from "@app/space/components/notes/metadata/zap";
import { createReplyNote } from "@libs/storage";
import { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
import { LoaderIcon, ReplyIcon, RepostIcon, ZapIcon } from "@shared/icons";
import { RelayContext } from "@shared/relayProvider";
import { decode } from "light-bolt11-decoder";
import { useContext } from "react";
import useSWR from "swr";

const fetcher = async ([, ndk, id]) => {
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
};

export function NoteMetadata({
	id,
	eventPubkey,
}: {
	id: string;
	eventPubkey: string;
}) {
	const ndk = useContext(RelayContext);
	const { data } = useSWR(["note-metadata", ndk, id], fetcher);

	return (
		<div
			onClick={(e) => e.stopPropagation()}
			onKeyDown={(e) => e.stopPropagation()}
			className="inline-flex items-center gap-2 w-full h-12 mt-4"
		>
			{!data ? (
				<>
					<div className="w-20 group inline-flex items-center gap-1.5">
						<ReplyIcon
							width={16}
							height={16}
							className="text-zinc-400 group-hover:text-green-400"
						/>
						<LoaderIcon
							width={16}
							height={16}
							className="animate-spin text-black dark:text-white"
						/>
					</div>
					<div className="w-20 group inline-flex items-center gap-1.5">
						<RepostIcon
							width={16}
							height={16}
							className="text-zinc-400 group-hover:text-green-400"
						/>
						<LoaderIcon
							width={16}
							height={16}
							className="animate-spin text-black dark:text-white"
						/>
					</div>
					<div className="w-20 group inline-flex items-center gap-1.5">
						<ZapIcon
							width={16}
							height={16}
							className="text-zinc-400 group-hover:text-green-400"
						/>
						<LoaderIcon
							width={16}
							height={16}
							className="animate-spin text-black dark:text-white"
						/>
					</div>
				</>
			) : (
				<>
					<NoteReply id={id} replies={data.replies} />
					<NoteRepost id={id} pubkey={eventPubkey} reposts={data.reposts} />
					<NoteZap zaps={data.zap} />
				</>
			)}
		</div>
	);
}
