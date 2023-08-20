import { useCallback, useEffect } from 'react';

import { FeedWidget } from '@app/space/components/widgets/feed';
import { HashtagWidget } from '@app/space/components/widgets/hashtag';
import { NetworkWidget } from '@app/space/components/widgets/network';
import { ThreadBlock } from '@app/space/components/widgets/thread';
import { UserWidget } from '@app/space/components/widgets/user';

import { useStorage } from '@libs/storage/provider';

import { LoaderIcon, PlusIcon } from '@shared/icons';

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
      if (!widget) return;
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
    <div className="scrollbar-hide inline-flex h-full w-full min-w-full flex-nowrap items-start divide-x divide-white/5 overflow-x-auto overflow-y-hidden">
      {!widgets ? (
        <div className="flex shrink-0 grow-0 basis-[400px] flex-col">
          <div className="flex w-full flex-1 items-center justify-center p-3">
            <LoaderIcon className="h-5 w-5 animate-spin text-white/10" />
          </div>
        </div>
      ) : (
        widgets.map((widget) => renderItem(widget))
      )}
      <div className="flex h-full shrink-0 grow-0 basis-[400px] flex-col">
        <div className="inline-flex h-full w-full flex-col items-center justify-center">
          <button type="button" className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10">
              <PlusIcon className="h-5 w-5 text-white" />
            </div>
            <p className="font-medium text-white/50">Add widget</p>
          </button>
        </div>
      </div>
    </div>
  );
}
