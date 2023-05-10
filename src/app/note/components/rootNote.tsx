import { Kind1 } from '@app/note/components/kind1';
import { Kind1063 } from '@app/note/components/kind1063';
import NoteMetadata from '@app/note/components/metadata';
import { NoteSkeleton } from '@app/note/components/skeleton';
import { NoteDefaultUser } from '@app/note/components/user/default';

import { RelayContext } from '@shared/relayProvider';

import { READONLY_RELAYS } from '@stores/constants';

import { noteParser } from '@utils/parser';

import { memo, useContext } from 'react';
import useSWRSubscription from 'swr/subscription';
import { navigate } from 'vite-plugin-ssr/client/router';

function isJSON(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const RootNote = memo(function RootNote({ id, fallback }: { id: string; fallback?: any }) {
  const pool: any = useContext(RelayContext);
  const parseFallback = isJSON(fallback) ? JSON.parse(fallback) : null;

  const { data, error } = useSWRSubscription(parseFallback ? null : id, (key, { next }) => {
    const unsubscribe = pool.subscribe(
      [
        {
          ids: [key],
        },
      ],
      READONLY_RELAYS,
      (event: any) => {
        next(null, event);
      },
      undefined,
      undefined,
      {
        unsubscribeOnEose: true,
      }
    );

    return () => {
      unsubscribe();
    };
  });

  const openNote = (e) => {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      navigate(`/app/note?id=${id}`);
    } else {
      e.stopPropagation();
    }
  };

  const kind1 = !error && data?.kind === 1 ? noteParser(data) : null;
  const kind1063 = !error && data?.kind === 1063 ? data.tags : null;

  if (parseFallback) {
    const contentFallback = noteParser(parseFallback);

    return (
      <div onClick={(e) => openNote(e)} className="flex flex-col px-3">
        <NoteDefaultUser pubkey={parseFallback.pubkey} time={parseFallback.created_at} />
        <div className="mt-3 pl-[46px]">
          <Kind1 content={contentFallback} />
          <NoteMetadata id={parseFallback.id} eventPubkey={parseFallback.pubkey} />
        </div>
      </div>
    );
  }

  return (
    <div onClick={(e) => openNote(e)} className="flex flex-col px-3">
      {data ? (
        <>
          <NoteDefaultUser pubkey={data.pubkey} time={data.created_at} />
          <div className="mt-3 pl-[46px]">
            {kind1 && <Kind1 content={kind1} />}
            {kind1063 && <Kind1063 metadata={kind1063} />}
            <NoteMetadata id={data.id} eventPubkey={data.pubkey} />
          </div>
        </>
      ) : (
        <NoteSkeleton />
      )}
    </div>
  );
});
