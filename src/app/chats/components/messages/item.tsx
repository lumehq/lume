import { useDecryptMessage } from '@app/chats/hooks/useDecryptMessage';

import { MentionNote } from '@shared/notes/mentions/note';
import { ImagePreview } from '@shared/notes/preview/image';
import { LinkPreview } from '@shared/notes/preview/link';
import { VideoPreview } from '@shared/notes/preview/video';
import { User } from '@shared/user';

import { parser } from '@utils/parser';

export function ChatMessageItem({
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
    data['content'] = decryptedContent;
  }
  // parse the note content
  const content = parser(data);

  return (
    <div className="flex h-min min-h-min w-full select-text flex-col px-5 py-3 hover:bg-black/20">
      <div className="flex flex-col">
        <User pubkey={data.sender_pubkey} time={data.created_at} isChat={true} />
        <div className="-mt-[20px] pl-[49px]">
          <p className="select-text whitespace-pre-line break-words text-base text-white">
            {content.parsed}
          </p>
          {content.images.length > 0 && <ImagePreview urls={content.images} />}
          {content.videos.length > 0 && <VideoPreview urls={content.videos} />}
          {content.links.length > 0 && <LinkPreview urls={content.links} />}
          {content.notes.length > 0 &&
            content.notes.map((note: string) => <MentionNote key={note} id={note} />)}
        </div>
      </div>
    </div>
  );
}
