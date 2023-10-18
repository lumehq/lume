import { useCallback, useEffect, useRef } from 'react';
import { VList, VListHandle } from 'virtua';

import { ToggleWidgetList } from '@app/space/components/toggle';
import { WidgetList } from '@app/space/components/widgetList';

import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';
import {
  GlobalArticlesWidget,
  GlobalFilesWidget,
  GlobalHashtagWidget,
  LearnNostrWidget,
  LocalArticlesWidget,
  LocalFeedsWidget,
  LocalFilesWidget,
  LocalFollowsWidget,
  LocalNetworkWidget,
  LocalThreadWidget,
  LocalUserWidget,
  TrendingAccountsWidget,
  TrendingNotesWidget,
  XfeedsWidget,
  XhashtagWidget,
} from '@shared/widgets';

import { WidgetKinds, useWidgets } from '@stores/widgets';

import { Widget } from '@utils/types';

export function SpaceScreen() {
  const { db } = useStorage();
  const vlistRef = useRef<VListHandle>(null);

  const [widgets, fetchWidgets] = useWidgets((state) => [
    state.widgets,
    state.fetchWidgets,
  ]);

  const renderItem = useCallback(
    (widget: Widget) => {
      if (!widget) return;
      switch (widget.kind) {
        case WidgetKinds.local.network:
          return <LocalNetworkWidget key={widget.id} />;
        case WidgetKinds.local.follows:
          return <LocalFollowsWidget key={widget.id} params={widget} />;
        case WidgetKinds.local.feeds:
          return <LocalFeedsWidget key={widget.id} params={widget} />;
        case WidgetKinds.local.files:
          return <LocalFilesWidget key={widget.id} params={widget} />;
        case WidgetKinds.local.articles:
          return <LocalArticlesWidget key={widget.id} params={widget} />;
        case WidgetKinds.local.user:
          return <LocalUserWidget key={widget.id} params={widget} />;
        case WidgetKinds.local.thread:
          return <LocalThreadWidget key={widget.id} params={widget} />;
        case WidgetKinds.global.hashtag:
          return <GlobalHashtagWidget key={widget.id} params={widget} />;
        case WidgetKinds.global.articles:
          return <GlobalArticlesWidget key={widget.id} params={widget} />;
        case WidgetKinds.global.files:
          return <GlobalFilesWidget key={widget.id} params={widget} />;
        case WidgetKinds.nostrBand.trendingAccounts:
          return <TrendingAccountsWidget key={widget.id} params={widget} />;
        case WidgetKinds.nostrBand.trendingNotes:
          return <TrendingNotesWidget key={widget.id} params={widget} />;
        case WidgetKinds.tmp.xfeed:
          return <XfeedsWidget key={widget.id} params={widget} />;
        case WidgetKinds.tmp.xhashtag:
          return <XhashtagWidget key={widget.id} params={widget} />;
        case WidgetKinds.tmp.list:
          return <WidgetList key={widget.id} params={widget} />;
        case WidgetKinds.other.learnNostr:
          return <LearnNostrWidget key={widget.id} params={widget} />;
        default:
          return null;
      }
    },
    [widgets]
  );

  useEffect(() => {
    fetchWidgets(db);
  }, [fetchWidgets]);

  return (
    <VList
      className="h-full w-full flex-nowrap overflow-x-auto !overflow-y-hidden scrollbar-none"
      horizontal
      ref={vlistRef}
    >
      {!widgets ? (
        <div className="flex h-full w-[420px] flex-col items-center justify-center">
          <LoaderIcon className="h-5 w-5 animate-spin text-neutral-900 dark:text-neutral-100" />
        </div>
      ) : (
        widgets.map((widget) => renderItem(widget))
      )}
      <ToggleWidgetList />
    </VList>
  );
}
