import { NoteContent } from '@lume/app/note/components/content';
import NoteFile from '@lume/app/note/components/file';
import NoteMetadata from '@lume/app/note/components/metadata';
import { NoteDefaultUser } from '@lume/app/note/components/user/default';
import { RelayContext } from '@lume/shared/relayProvider';
import { READONLY_RELAYS } from '@lume/stores/constants';
import { noteParser } from '@lume/utils/parser';

import { memo, useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
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
          <NoteContent content={contentFallback} />
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
            {kind1 && <NoteContent content={kind1} />}
            {kind1063 && <NoteFile url={kind1063[0][1]} />}
            <NoteMetadata id={data.id} eventPubkey={data.pubkey} />
          </div>
        </>
      ) : (
        <Skeleton baseColor="#27272a" containerClassName="flex-1" />
      )}
    </div>
  );
});
