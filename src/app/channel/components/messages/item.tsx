import { MessageHideButton } from "@app/channel/components/messages/hideButton";
import { MessageMuteButton } from "@app/channel/components/messages/muteButton";
import { MessageReplyButton } from "@app/channel/components/messages/replyButton";
import { ChannelMessageUser } from "@app/channel/components/messages/user";
import { ChannelMessageUserMute } from "@app/channel/components/messages/userMute";
import { MentionNote } from "@app/space/components/notes/mentions/note";
import { ImagePreview } from "@app/space/components/notes/preview/image";
import { VideoPreview } from "@app/space/components/notes/preview/video";
import { parser } from "@utils/parser";
import { useMemo, useState } from "react";

export function ChannelMessageItem({ data }: { data: any }) {
	const content = useMemo(() => parser(data), [data]);
	const [hide, setHide] = useState(data.hide);

	const toggleHide = () => {
		setHide((prev) => !prev);
	};

	if (data.mute)
		return (
			<div className="group relative flex h-min min-h-min w-full select-text flex-col px-5 py-3 hover:bg-black/20">
				<ChannelMessageUserMute pubkey={data.pubkey} />
			</div>
		);

	return (
		<div className="group relative flex h-min min-h-min w-full select-text flex-col px-5 py-3 hover:bg-black/20">
			<div className="flex flex-col">
				<ChannelMessageUser pubkey={data.pubkey} time={data.created_at} />
				<div className="-mt-[20px] pl-[49px]">
					{hide ? (
						<>
							<p className="leading-tight italic text-zinc-400">
								[hided message]
							</p>
							<button type="button" onClick={() => toggleHide()}>
								show
							</button>
						</>
					) : (
						<>
							<p className="whitespace-pre-line break-words text-base leading-tight">
								{content.parsed}
							</p>
							{Array.isArray(content.images) && content.images.length ? (
								<ImagePreview urls={content.images} />
							) : (
								<></>
							)}
							{Array.isArray(content.videos) && content.videos.length ? (
								<VideoPreview urls={content.videos} />
							) : (
								<></>
							)}
							{Array.isArray(content.notes) && content.notes.length ? (
								content.notes.map((note: string) => (
									<MentionNote key={note} id={note} />
								))
							) : (
								<></>
							)}
						</>
					)}
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
