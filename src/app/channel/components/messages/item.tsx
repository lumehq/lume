import MessageHideButton from "@app/channel/components/messages/hideButton";
import MessageMuteButton from "@app/channel/components/messages/muteButton";
import MessageReplyButton from "@app/channel/components/messages/replyButton";
import { ChannelMessageUser } from "@app/channel/components/messages/user";
import { noteParser } from "@utils/parser";
import { useMemo } from "react";

export function ChannelMessageItem({ data }: { data: any }) {
	const content = useMemo(() => noteParser(data), [data]);

	return (
		<div className="group relative flex h-min min-h-min w-full select-text flex-col px-5 py-3 hover:bg-black/20">
			<div className="flex flex-col">
				<ChannelMessageUser pubkey={data.pubkey} time={data.created_at} />
				<div className="-mt-[20px] pl-[49px]">
					<div className="whitespace-pre-line break-words text-base leading-tight">
						{data.hide ? (
							<span className="italic text-zinc-400">[hided message]</span>
						) : (
							content.parsed
						)}
					</div>
				</div>
			</div>
			<div className="absolute -top-4 right-4 z-10 hidden group-hover:inline-flex">
				<div className="inline-flex h-8 items-center justify-center gap-1.5 rounded bg-zinc-900 px-0.5 shadow-md shadow-black/20 ring-1 ring-zinc-800">
					<MessageReplyButton
						id={data.id}
						pubkey={data.pubkey}
						content={data.content}
					/>
					<MessageHideButton id={data.id} />
					<MessageMuteButton pubkey={data.pubkey} />
				</div>
			</div>
		</div>
	);
}
