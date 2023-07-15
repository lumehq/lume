import { NoteMetadata } from '@shared/notes/metadata';
import { User } from '@shared/user';

import { parser } from '@utils/parser';

export function Reply({ data }: { data: any }) {
  const content = parser(data);

  return (
    <div className="mb-3 flex h-min min-h-min w-full select-text flex-col rounded-md bg-zinc-900 px-3 pt-5">
      <div className="flex flex-col">
        <User pubkey={data.pubkey} time={data.created_at} />
        <div className="-mt-[20px] pl-[50px]">
          <NoteMetadata id={data.event_id} eventPubkey={data.pubkey} />
        </div>
      </div>
    </div>
  );
}
