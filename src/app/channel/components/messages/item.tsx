import { MessageHideButton } from "@app/channel/components/messages/hideButton";
import { MessageMuteButton } from "@app/channel/components/messages/muteButton";
import { MessageReplyButton } from "@app/channel/components/messages/replyButton";
import { MentionNote } from "@shared/notes/mentions/note";
import { ImagePreview } from "@shared/notes/preview/image";
import { LinkPreview } from "@shared/notes/preview/link";
import { VideoPreview } from "@shared/notes/preview/video";
import { User } from "@shared/user";
import { parser } from "@utils/parser";
import { LumeEvent } from "@utils/types";

export function ChannelMessageItem({ data }: { data: LumeEvent }) {
	const content = parser(data);

	return (
		<div className="group relative flex h-min min-h-min w-full select-text flex-col px-5 py-3 hover:bg-black/20">
			<div className="flex flex-col">
				<User pubkey={data.pubkey} time={data.created_at} />
				<div className="-mt-[20px] pl-[49px]">
					<p className="select-text whitespace-pre-line break-words text-base text-zinc-100">
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
					{Array.isArray(content.links) && content.links.length ? (
						<LinkPreview urls={content.links} />
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
