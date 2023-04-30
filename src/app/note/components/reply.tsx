import { contentParser } from '@lume/app/newsfeed/components/contentParser';

import NoteReplyUser from './user';

export default function NoteReply({ data }: { data: any }) {
  const content = contentParser(data.content, data.tags);

  return (
    <div className="flex h-min min-h-min w-full select-text flex-col px-5 py-3.5 hover:bg-black/20">
      <div className="flex flex-col">
        <NoteReplyUser pubkey={data.pubkey} time={data.created_at} />
        <div className="-mt-[17px] pl-[48px]">
          <div className="whitespace-pre-line break-words break-words text-sm leading-tight">{content}</div>
        </div>
      </div>
    </div>
  );
}
