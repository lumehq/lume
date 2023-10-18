import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { nip19 } from 'nostr-tools';
import { AddressPointer, EventPointer } from 'nostr-tools/lib/types/nip19';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useStorage } from '@libs/storage/provider';

import { ArrowLeftIcon, CheckCircleIcon, ReplyIcon, ShareIcon } from '@shared/icons';
import {
  ArticleDetailNote,
  NoteActions,
  NoteReplyForm,
  NoteStats,
  UnknownNote,
} from '@shared/notes';
import { RepliesList } from '@shared/notes/replies/list';
import { NoteSkeleton } from '@shared/notes/skeleton';
import { User } from '@shared/user';

import { useEvent } from '@utils/hooks/useEvent';

export function ArticleNoteScreen() {
  const navigate = useNavigate();
  const replyRef = useRef(null);

  const { id } = useParams();
  const { db } = useStorage();

  const naddr = id.startsWith('naddr') ? (nip19.decode(id).data as AddressPointer) : null;
  const { status, data } = useEvent(id, naddr);

  const [isCopy, setIsCopy] = useState(false);

  const share = async () => {
    await writeText(
      'https://njump.me/' +
        nip19.neventEncode({ id: data.id, author: data.pubkey } as EventPointer)
    );
    // update state
    setIsCopy(true);
    // reset state after 2 sec
    setTimeout(() => setIsCopy(false), 2000);
  };

  const scrollToReply = () => {
    replyRef.current.scrollIntoView();
  };

  const renderKind = (event: NDKEvent) => {
    switch (event.kind) {
      case NDKKind.Article:
        return <ArticleDetailNote event={event} />;
      default:
        return <UnknownNote event={event} />;
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto scroll-smooth scrollbar-none">
      <div className="container mx-auto px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-5">
          <div className="col-span-1 pr-8">
            <div className="sticky top-16 flex flex-col items-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-200 dark:bg-neutral-800"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div className="flex flex-col divide-y divide-neutral-300 rounded-xl bg-neutral-200 dark:divide-neutral-700 dark:bg-neutral-800">
                <button
                  type="button"
                  onClick={share}
                  className="sticky top-16 inline-flex h-12 w-12 items-center justify-center rounded-t-xl"
                >
                  {isCopy ? (
                    <CheckCircleIcon className="h-5 w-5 text-teal-500" />
                  ) : (
                    <ShareIcon className="h-5 w-5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={scrollToReply}
                  className="sticky top-16 inline-flex h-12 w-12 items-center justify-center rounded-b-xl"
                >
                  <ReplyIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="col-span-3 flex flex-col gap-1.5">
            {status === 'loading' ? (
              <div className="px-3 py-1.5">
                <div className="rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
                  <NoteSkeleton />
                </div>
              </div>
            ) : (
              <>
                <div className="flex h-min w-full flex-col gap-1 px-3">
                  <div>
                    <User pubkey={data.pubkey} time={data.created_at} variant="thread" />
                    <div className="mt-2">{renderKind(data)}</div>
                    <div className="mb-3 mt-3">
                      <NoteActions
                        id={data.id}
                        pubkey={data.pubkey}
                        extraButtons={false}
                      />
                    </div>
                  </div>
                  <NoteStats id={data.id} />
                </div>
                <div ref={replyRef} className="px-3">
                  <NoteReplyForm id={data.id} pubkey={db.account.pubkey} />
                  <RepliesList id={data.id} />
                </div>
              </>
            )}
          </div>
          <div className="col-span-1" />
        </div>
      </div>
    </div>
  );
}
