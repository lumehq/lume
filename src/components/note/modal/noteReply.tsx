/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@components/note/atoms/user';
import Content from '@components/note/content';

export default function NoteReply({ event }: { event: any }) {
  return (
    <div className="flex h-min min-h-min w-full select-text flex-col border-b border-zinc-800 py-4 hover:bg-zinc-800">
      <div className="flex flex-col">
        <User pubkey={event.pubkey} time={event.created_at} />
        <div className="-mt-5 pl-[60px]">
          <div className="flex flex-col gap-6">
            <Content data={event.content} />
          </div>
        </div>
      </div>
    </div>
  );
}
