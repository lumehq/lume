import NoteMetadata from '@components/note/metadata';
import { UserExtend } from '@components/user/extend';

import { contentParser } from '@utils/parser';

import { useRouter } from 'next/navigation';
import { memo } from 'react';

export const RootNote = memo(function RootNote({ event }: { event: any }) {
  const router = useRouter();
  const content = contentParser(event.content, event.tags);

  const openUserPage = (e) => {
    e.stopPropagation();
    router.push(`/users/${event.pubkey}`);
  };

  const openThread = (e) => {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      router.push(`/newsfeed/${event.id}`);
    } else {
      e.stopPropagation();
    }
  };

  return (
    <div onClick={(e) => openThread(e)} className="relative z-10 flex flex-col">
      <div onClick={(e) => openUserPage(e)}>
        <UserExtend pubkey={event.pubkey} time={event.created_at} />
      </div>
      <div className="-mt-5 pl-[52px]">
        <div className="flex flex-col gap-2">
          <div className="prose prose-zinc max-w-none whitespace-pre-line break-words text-[15px] leading-tight dark:prose-invert prose-p:m-0 prose-p:text-[15px] prose-p:leading-tight prose-a:font-normal prose-a:text-fuchsia-500 prose-a:no-underline prose-img:m-0 prose-video:m-0">
            {content}
          </div>
        </div>
      </div>
      <div onClick={(e) => e.stopPropagation()} className="mt-5 pl-[52px]">
        <NoteMetadata
          eventID={event.id}
          eventPubkey={event.pubkey}
          eventContent={event.content}
          eventTime={event.created_at}
        />
      </div>
    </div>
  );
});
