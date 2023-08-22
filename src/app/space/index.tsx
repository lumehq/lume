import { useCallback, useEffect } from 'react';

import { AddWidgetButton } from '@app/space/components/button';
import { FeedWidgetForm } from '@app/space/components/forms/feed';
import { HashTagWidgetForm } from '@app/space/components/forms/hashtag';
import { FeedWidget } from '@app/space/components/widgets/feed';
import { HashtagWidget } from '@app/space/components/widgets/hashtag';
import { NetworkWidget } from '@app/space/components/widgets/network';
import { ThreadBlock } from '@app/space/components/widgets/thread';
import { TrendingNotesWidget } from '@app/space/components/widgets/trendingNotes';
import { TrendingProfilesWidget } from '@app/space/components/widgets/trendingProfile';
import { UserWidget } from '@app/space/components/widgets/user';

import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';

import { WidgetKinds, useWidgets } from '@stores/widgets';

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
        case WidgetKinds.feed:
          return <FeedWidget key={widget.id} params={widget} />;
        case WidgetKinds.thread:
          return <ThreadBlock key={widget.id} params={widget} />;
        case WidgetKinds.hashtag:
          return <HashtagWidget key={widget.id} params={widget} />;
        case WidgetKinds.user:
          return <UserWidget key={widget.id} params={widget} />;
        case WidgetKinds.trendingProfiles:
          return <TrendingProfilesWidget key={widget.id} params={widget} />;
        case WidgetKinds.trendingNotes:
          return <TrendingNotesWidget key={widget.id} params={widget} />;
        case WidgetKinds.network:
          return <NetworkWidget key={widget.id} />;
        case WidgetKinds.xhashtag:
          return <HashTagWidgetForm key={widget.id} params={widget} />;
        case WidgetKinds.xfeed:
          return <FeedWidgetForm key={widget.id} params={widget} />;
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
      <AddWidgetButton />
    </div>
  );
}
