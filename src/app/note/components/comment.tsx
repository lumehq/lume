import { NoteDefaultUser } from '@lume/app/note/components/user/default';

import { memo } from 'react';

export const NoteComment = memo(function NoteComment({ event }: { event: any }) {
  return (
    <div className="relative z-10 flex h-min min-h-min w-full select-text flex-col border-b border-zinc-800 px-3 py-5 hover:bg-black/20">
      <div className="relative z-10 flex flex-col">
        <NoteDefaultUser pubkey={event.pubkey} time={event.created_at} />
        <div className="-mt-5 pl-[52px]">
          <div className="flex flex-col gap-2">
            <div className="prose prose-zinc max-w-none break-words text-[15px] leading-tight dark:prose-invert prose-p:m-0 prose-p:text-[15px] prose-p:leading-tight prose-a:font-normal prose-a:text-fuchsia-500 prose-a:no-underline prose-img:m-0 prose-video:m-0">
              {event.content}
            </div>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()} className="mt-5 pl-[52px]"></div>
      </div>
    </div>
  );
});
