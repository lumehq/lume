import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useCallback } from 'react';
import { WVList } from 'virtua';

import { LoaderIcon } from '@shared/icons';
import {
  MemoizedArticleKind,
  MemoizedFileKind,
  MemoizedTextKind,
  NoteActions,
  NoteReplyForm,
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
          return <MemoizedTextKind content={event.content} />;
        case NDKKind.Article:
          return <MemoizedArticleKind id={event.id} tags={event.tags} />;
        case 1063:
          return <MemoizedFileKind tags={event.tags} />;
        default:
          return null;
      }
    },
    [data]
  );

  return (
    <WidgetWrapper>
      <TitleBar id={params.id} title={params.title} />
      <WVList className="flex-1 overflow-y-auto px-3 pb-5">
        {status === 'pending' ? (
          <div className="flex h-16 items-center justify-center rounded-xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950">
            <LoaderIcon className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex flex-col rounded-xl bg-neutral-50 dark:bg-neutral-950">
              <User pubkey={data.pubkey} time={data.created_at} variant="thread" />
              {renderKind(data)}
              <NoteActions id={data.id} pubkey={data.pubkey} />
            </div>
            <NoteReplyForm eventId={params.content} />
            <ReplyList eventId={data.id} />
          </>
        )}
      </WVList>
    </WidgetWrapper>
  );
}
