import { ChatMessageUser } from "@app/chat/components/messages/user";
import { useDecryptMessage } from "@app/chat/hooks/useDecryptMessage";
import ImagePreview from "@app/note/components/preview/image";
import VideoPreview from "@app/note/components/preview/video";
import { noteParser } from "@utils/parser";
import { memo } from "react";

export const ChatMessageItem = memo(function ChatMessageItem({
	data,
	userPubkey,
	userPrivkey,
}: {
	data: any;
	userPubkey: string;
	userPrivkey: string;
}) {
	const decryptedContent = useDecryptMessage(data, userPubkey, userPrivkey);
	// if we have decrypted content, use it instead of the encrypted content
	if (decryptedContent) {
		data["content"] = decryptedContent;
	}
	// parse the note content
	const content = noteParser(data);

	return (
		<div className="flex h-min min-h-min w-full select-text flex-col px-5 py-3 hover:bg-black/20">
			<div className="flex flex-col">
				<ChatMessageUser pubkey={data.sender_pubkey} time={data.created_at} />
				<div className="-mt-[20px] pl-[49px]">
					<div className="whitespace-pre-line break-words text-base text-zinc-100 leading-tight">
						{content.parsed || ""}
					</div>
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
				</div>
			</div>
		</div>
	);
});
