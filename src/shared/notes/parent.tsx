import { Kind1 } from '@shared/notes/contents/kind1';
import { Kind1063 } from '@shared/notes/contents/kind1063';
import { NoteMetadata } from '@shared/notes/metadata';
import { NoteSkeleton } from '@shared/notes/skeleton';
import { User } from '@shared/user';

import { useEvent } from '@utils/hooks/useEvent';

export function NoteParent({ id }: { id: string }) {
  const { status, data } = useEvent(id);

  return (
    <div className="relative flex flex-col pb-6">
      <div className="absolute left-[18px] top-0 h-full w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600" />
      {status === 'loading' ? (
        <NoteSkeleton />
      ) : status === 'success' ? (
        <>
          <User pubkey={data.pubkey} time={data.created_at} />
          <div className="-mt-6 pl-[49px]">
            {data.kind === 1 && <Kind1 content={data.content} />}
            {data.kind === 1063 && <Kind1063 metadata={data.tags} />}
            {data.kind !== 1 && data.kind !== 1063 && (
              <div className="flex flex-col gap-2">
                <div className="inline-flex flex-col gap-1 rounded-md bg-zinc-800 px-2 py-2">
                  <span className="text-sm font-medium leading-none text-zinc-500">
                    Kind: {data.kind}
                  </span>
                  <p className="text-sm leading-none text-fuchsia-500">
                    Lume isn&apos;t fully support this kind in newsfeed
                  </p>
                </div>
                <div className="select-text whitespace-pre-line	break-words text-base text-zinc-100">
                  <p>{data.content || data.toString()}</p>
                </div>
              </div>
            )}
            <NoteMetadata id={data.event_id || data.id} eventPubkey={data.pubkey} />
          </div>
        </>
      ) : (
        <p>Failed to fetch event</p>
      )}
    </div>
  );
}
