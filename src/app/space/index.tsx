import { useCallback, useEffect } from 'react';

import { FeedModal } from '@app/space/components/modals/feed';
import { HashtagModal } from '@app/space/components/modals/hashtag';
import { ImageModal } from '@app/space/components/modals/image';
import { FeedWidget } from '@app/space/components/widgets/feed';
import { HashtagWidget } from '@app/space/components/widgets/hashtag';
import { NetworkWidget } from '@app/space/components/widgets/network';
import { ThreadBlock } from '@app/space/components/widgets/thread';
import { UserWidget } from '@app/space/components/widgets/user';

import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';

import { useWidgets } from '@stores/widgets';

import { Widget } from '@utils/types';

export function SpaceScreen() {
  const { db } = useStorage();

  const [widgets, fetchWidgets] = useWidgets((state) => [
    state.widgets,
    state.fetchWidgets,
  ]);

  const renderItem = useCallback(
    (widget: Widget) => {
      switch (widget.kind) {
        case 1:
          return <FeedWidget key={widget.id} params={widget} />;
        case 2:
          return <ThreadBlock key={widget.id} params={widget} />;
        case 3:
          return <HashtagWidget key={widget.id} params={widget} />;
        case 5:
          return <UserWidget key={widget.id} params={widget} />;
        case 9999:
          return <NetworkWidget key={widget.id} />;
        default:
          break;
      }
    },
    [widgets]
  );

  useEffect(() => {
    fetchWidgets(db);
  }, [fetchWidgets]);

  return (
    <div className="scrollbar-hide flex h-full w-full flex-nowrap divide-x divide-white/5 overflow-x-auto overflow-y-hidden">
      {!widgets ? (
        <div className="flex w-[400px] shrink-0 flex-col">
          <div className="flex w-full flex-1 items-center justify-center p-3">
            <LoaderIcon className="h-5 w-5 animate-spin text-white/10" />
          </div>
        </div>
      ) : (
        widgets.map((widget) => renderItem(widget))
      )}
      <div className="flex w-[250px] shrink-0 flex-col">
        <div className="inline-flex h-full w-full flex-col items-center justify-center gap-1">
          <FeedModal />
          <ImageModal />
          <HashtagModal />
        </div>
      </div>
      <div className="w-[150px] shrink-0" />
    </div>
  );
}
