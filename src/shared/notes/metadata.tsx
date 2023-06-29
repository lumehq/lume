import { createBlock, createReplyNote } from "@libs/storage";
import { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
import * as Tooltip from "@radix-ui/react-tooltip";
import { LoaderIcon, ReplyIcon, RepostIcon, ZapIcon } from "@shared/icons";
import { ThreadIcon } from "@shared/icons/thread";
import { NoteReply } from "@shared/notes/metadata/reply";
import { NoteRepost } from "@shared/notes/metadata/repost";
import { NoteZap } from "@shared/notes/metadata/zap";
import { RelayContext } from "@shared/relayProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { decode } from "light-bolt11-decoder";
import { useContext } from "react";

export function NoteMetadata({
	id,
	rootID,
	eventPubkey,
}: {
	id: string;
	rootID?: string;
	eventPubkey: string;
}) {
	const ndk = useContext(RelayContext);
	const queryClient = useQueryClient();

	const { status, data } = useQuery(["note-metadata", id], async () => {
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
	});

	const block = useMutation({
		mutationFn: (data: any) => {
			return createBlock(data.kind, data.title, data.content);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blocks"] });
		},
	});

	const openThread = (thread: string) => {
		const selection = window.getSelection();
		if (selection.toString().length === 0) {
			block.mutate({ kind: 2, title: "Thread", content: thread });
		} else {
			event.stopPropagation();
		}
	};

	if (status === "loading") {
		return (
			<div className="inline-flex items-center w-full h-12 mt-2">
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
			</div>
		);
	}

	return (
		<Tooltip.Provider>
			<div className="inline-flex items-center justify-between w-full h-12 mt-2">
				<div className="inline-flex justify-between items-center">
					<NoteReply
						id={id}
						rootID={rootID}
						pubkey={eventPubkey}
						replies={data.replies}
					/>
					<NoteRepost id={id} pubkey={eventPubkey} reposts={data.reposts} />
					<NoteZap zaps={data.zap} />
				</div>
				<Tooltip.Root delayDuration={150}>
					<Tooltip.Trigger asChild>
						<button
							type="button"
							onClick={() => openThread(id)}
							className="w-6 h-6 inline-flex items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800 hover:bg-zinc-700"
						>
							<ThreadIcon className="w-4 h-4 text-zinc-400" />
						</button>
					</Tooltip.Trigger>
					<Tooltip.Portal>
						<Tooltip.Content
							className="-left-10 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade select-none text-sm rounded-md text-zinc-100 bg-zinc-800/80 backdrop-blur-lg px-3.5 py-1.5 leading-none will-change-[transform,opacity]"
							sideOffset={5}
						>
							Open thread
							<Tooltip.Arrow className="fill-zinc-800/80 backdrop-blur-lg" />
						</Tooltip.Content>
					</Tooltip.Portal>
				</Tooltip.Root>
			</div>
		</Tooltip.Provider>
	);
}
