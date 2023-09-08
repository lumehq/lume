import { useCallback, useEffect } from 'react';

import { ToggleWidgetList } from '@app/space/components/toggle';
import { WidgetList } from '@app/space/components/widgetList';

import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';
import {
  GlobalArticlesWidget,
  GlobalFilesWidget,
  GlobalHashtagWidget,
  LocalArticlesWidget,
  LocalFeedsWidget,
  LocalFilesWidget,
  LocalNetworkWidget,
  LocalThreadWidget,
  LocalUserWidget,
  TrendingAccountsWidget,
  TrendingNotesWidget,
  XfeedsWidget,
  XhashtagWidget,
} from '@shared/widgets';
import { LocalFollowsWidget } from '@shared/widgets/local/follows';

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
          return <XhashtagWidget key={widget.id} params={widget} />;
        case WidgetKinds.tmp.xhashtag:
          return <XfeedsWidget key={widget.id} params={widget} />;
        case WidgetKinds.tmp.list:
          return <WidgetList key={widget.id} params={widget} />;
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
      <ToggleWidgetList />
    </div>
  );
}
