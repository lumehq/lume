import { NDKEvent } from '@nostr-dev-kit/ndk';

import { useDecryptMessage } from '@app/chats/hooks/useDecryptMessage';

import { ImagePreview, LinkPreview, MentionNote, VideoPreview } from '@shared/notes';
import { User } from '@shared/user';

import { parser } from '@utils/parser';

export function ChatMessage({
  message,
  userPubkey,
  userPrivkey,
}: {
  message: NDKEvent;
  userPubkey: string;
  userPrivkey: string;
}) {
  const decryptedContent = useDecryptMessage(message, userPubkey, userPrivkey);
  const richContent = parser(decryptedContent) ?? null;

  return (
    <div className="flex h-min min-h-min w-full select-text flex-col px-5 py-3 hover:bg-white/10">
      <div className="flex flex-col">
        <User pubkey={message.pubkey} time={message.created_at} variant="chat" />
        <div className="-mt-6 flex items-start gap-3">
          <div className="w-10 shrink-0" />
          {!richContent ? (
            <p>Decrypting...</p>
          ) : (
            <div>
              <p className="select-text whitespace-pre-line text-white">
                {richContent.parsed}
              </p>
              <div>
                {richContent.images.length > 0 && (
                  <ImagePreview urls={richContent.images} />
                )}
                {richContent.videos.length > 0 && (
                  <VideoPreview urls={richContent.videos} />
                )}
                {richContent.links.length > 0 && <LinkPreview urls={richContent.links} />}
                {richContent.notes.length > 0 &&
                  richContent.notes.map((note: string) => (
                    <MentionNote key={note} id={note} />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
