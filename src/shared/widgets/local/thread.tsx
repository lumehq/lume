import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useCallback } from 'react';
import { WVList } from 'virtua';

import { LoaderIcon } from '@shared/icons';
import {
  MemoizedArticleNote,
  MemoizedFileNote,
  MemoizedTextNote,
  NoteActions,
  NoteReplyForm,
  NoteStats,
  UnknownNote,
} from '@shared/notes';
import { ReplyList } from '@shared/notes/replies/list';
import { TitleBar } from '@shared/titleBar';
import { User } from '@shared/user';
import { WidgetWrapper } from '@shared/widgets';

import { useEvent } from '@utils/hooks/useEvent';
import { Widget } from '@utils/types';

export function LocalThreadWidget({ params }: { params: Widget }) {
  const { status, data } = useEvent(params.content);

  const renderKind = useCallback(
    (event: NDKEvent) => {
      switch (event.kind) {
        case NDKKind.Text:
          return <MemoizedTextNote content={event.content} />;
        case NDKKind.Article:
          return <MemoizedArticleNote event={event} />;
        case 1063:
          return <MemoizedFileNote event={event} />;
        default:
          return <UnknownNote event={event} />;
      }
    },
    [data]
  );

  return (
    <WidgetWrapper>
      <TitleBar id={params.id} title={params.title} />
      <WVList className="flex-1 overflow-y-auto px-3">
        {status === 'pending' ? (
          <div className="flex h-16 items-center justify-center rounded-xl bg-neutral-100 px-3 py-3 dark:bg-neutral-900">
            <LoaderIcon className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <div className="rounded-xl bg-neutral-100 px-3 py-3 dark:bg-neutral-900">
            <User pubkey={data.pubkey} time={data.created_at} variant="thread" />
            <div className="mt-2">{renderKind(data)}</div>
            <NoteActions id={params.content} pubkey={data.pubkey} extraButtons={false} />
          </div>
        )}
        <NoteStats id={params.content} />
        <hr className="my-4 h-px w-full border-none bg-neutral-100" />
        <NoteReplyForm id={params.content} />
        <ReplyList id={params.content} />
        <div className="h-10" />
      </WVList>
    </WidgetWrapper>
  );
}
