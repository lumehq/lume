import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { useStorage } from '@libs/storage/provider';

import {
  ArticleNote,
  FileNote,
  LinkPreview,
  NoteSkeleton,
  TextNote,
  UnknownNote,
} from '@shared/notes';
import { User } from '@shared/user';

import { WidgetKinds, useWidgets } from '@stores/widgets';

import { useEvent } from '@utils/hooks/useEvent';

export const MentionNote = memo(function MentionNote({ id }: { id: string }) {
  const { db } = useStorage();
  const { status, data } = useEvent(id);

  const setWidget = useWidgets((state) => state.setWidget);

  const openThread = (event, thread: string) => {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      setWidget(db, { kind: WidgetKinds.local.thread, title: 'Thread', content: thread });
    } else {
      event.stopPropagation();
    }
  };

  const renderKind = (event: NDKEvent) => {
    switch (event.kind) {
      case NDKKind.Text:
        return <TextNote content={event.content} />;
      case NDKKind.Article:
        return <ArticleNote event={event} />;
      case 1063:
        return <FileNote event={event} />;
      default:
        return <UnknownNote event={event} />;
    }
  };

  if (status === 'loading') {
    return (
      <div className="mt-3 cursor-default rounded-lg bg-white/10 px-3 py-3 backdrop-blur-xl">
        <NoteSkeleton />
      </div>
    );
  }

  if (status === 'error') {
    const noteLink = `https://njump.me/${nip19.noteEncode(id)}`;
    return (
      <div className="relative mt-3 flex flex-col">
        <div className="relative z-10 flex items-center gap-3">
          <div className="inline-flex h-6 w-6 items-end justify-center rounded bg-black pb-1">
            <img src="/lume.png" alt="lume" className="h-auto w-1/3" />
          </div>
          <h5 className="truncate font-semibold leading-none text-white">
            Lume <span className="text-green-500">(System)</span>
          </h5>
        </div>
        <div className="mt-1">
          <div className="mb-1 select-text rounded-lg bg-white/5 p-1.5 text-sm">
            Lume cannot find this post with your current relays, but you can view it via
            njump.me.{' '}
            <Link to={noteLink} className="text-fuchsia-500">
              Learn more
            </Link>
          </div>
          <LinkPreview urls={[noteLink]} />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => openThread(e, id)}
      onKeyDown={(e) => openThread(e, id)}
      role="button"
      tabIndex={0}
      className="mt-3 cursor-default rounded-lg bg-white/10 px-3 py-3 backdrop-blur-xl"
    >
      <User pubkey={data.pubkey} time={data.created_at} variant="mention" />
      <div className="mt-1">{renderKind(data)}</div>
    </div>
  );
});
