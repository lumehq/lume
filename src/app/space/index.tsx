import { useCallback, useEffect } from 'react';

import { FeedModal } from '@app/space/components/modals/feed';
import { HashtagModal } from '@app/space/components/modals/hashtag';
import { ImageModal } from '@app/space/components/modals/image';
import { FeedBlock } from '@app/space/components/widgets/feed';
import { HashtagBlock } from '@app/space/components/widgets/hashtag';
import { ImageBlock } from '@app/space/components/widgets/image';
import { NetworkBlock } from '@app/space/components/widgets/network';
import { ThreadBlock } from '@app/space/components/widgets/thread';
import { UserBlock } from '@app/space/components/widgets/user';

import { LoaderIcon } from '@shared/icons';

import { useWidgets } from '@stores/widgets';

import { Widget } from '@utils/types';

export function SpaceScreen() {
  const [widgets, fetchWidgets] = useWidgets((state) => [
    state.widgets,
    state.fetchWidgets,
  ]);

  const renderItem = useCallback(
    (widget: Widget) => {
      switch (widget.kind) {
        case 0:
          return <ImageBlock key={widget.id} params={widget} />;
        case 1:
          return <FeedBlock key={widget.id} params={widget} />;
        case 2:
          return <ThreadBlock key={widget.id} params={widget} />;
        case 3:
          return <HashtagBlock key={widget.id} params={widget} />;
        case 5:
          return <UserBlock key={widget.id} params={widget} />;
        default:
          break;
      }
    },
    [widgets]
  );

  useEffect(() => {
    fetchWidgets();
  }, [fetchWidgets]);

  return (
    <div className="scrollbar-hide flex h-full w-full flex-nowrap divide-x divide-white/5 overflow-x-auto overflow-y-hidden">
      <NetworkBlock />
      {!widgets ? (
        <div className="flex w-[350px] shrink-0 flex-col">
          <div className="flex w-full flex-1 items-center justify-center p-3">
            <LoaderIcon className="h-5 w-5 animate-spin text-white/10" />
          </div>
        </div>
      ) : (
        widgets.map((widget) => renderItem(widget))
      )}
      <div className="flex w-[350px] shrink-0 flex-col">
        <div className="inline-flex h-full w-full flex-col items-center justify-center gap-1">
          <FeedModal />
          <ImageModal />
          <HashtagModal />
        </div>
      </div>
      <div className="w-[250px] shrink-0" />
    </div>
  );
}
