import { useQuery } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { VList, VListHandle } from 'virtua';

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
  LocalThreadWidget,
  LocalUserWidget,
  NewsfeedWidget,
  NotificationWidget,
  TrendingAccountsWidget,
  TrendingNotesWidget,
  XfeedsWidget,
  XhashtagWidget,
} from '@shared/widgets';

import { WIDGET_KIND } from '@stores/constants';

import { Widget } from '@utils/types';

export function SpaceScreen() {
  const ref = useRef<VListHandle>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { db } = useStorage();
  const { status, data } = useQuery({
    queryKey: ['widgets'],
    queryFn: async () => {
      const dbWidgets = await db.getWidgets();
      const defaultWidgets = [
        {
          id: '9998',
          title: 'Notification',
          content: '',
          kind: WIDGET_KIND.local.notification,
        },
        {
          id: '9999',
          title: 'Newsfeed',
          content: '',
          kind: WIDGET_KIND.local.network,
        },
      ];

      return [...defaultWidgets, ...dbWidgets];
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const renderItem = useCallback((widget: Widget) => {
    switch (widget.kind) {
      case WIDGET_KIND.local.feeds:
        return <LocalFeedsWidget key={widget.id} params={widget} />;
      case WIDGET_KIND.local.files:
        return <LocalFilesWidget key={widget.id} params={widget} />;
      case WIDGET_KIND.local.articles:
        return <LocalArticlesWidget key={widget.id} params={widget} />;
      case WIDGET_KIND.local.user:
        return <LocalUserWidget key={widget.id} params={widget} />;
      case WIDGET_KIND.local.thread:
        return <LocalThreadWidget key={widget.id} params={widget} />;
      case WIDGET_KIND.global.hashtag:
        return <GlobalHashtagWidget key={widget.id} params={widget} />;
      case WIDGET_KIND.global.articles:
        return <GlobalArticlesWidget key={widget.id} params={widget} />;
      case WIDGET_KIND.global.files:
        return <GlobalFilesWidget key={widget.id} params={widget} />;
      case WIDGET_KIND.nostrBand.trendingAccounts:
        return <TrendingAccountsWidget key={widget.id} params={widget} />;
      case WIDGET_KIND.nostrBand.trendingNotes:
        return <TrendingNotesWidget key={widget.id} params={widget} />;
      case WIDGET_KIND.tmp.xfeed:
        return <XfeedsWidget key={widget.id} params={widget} />;
      case WIDGET_KIND.tmp.xhashtag:
        return <XhashtagWidget key={widget.id} params={widget} />;
      case WIDGET_KIND.tmp.list:
        return <WidgetList key={widget.id} params={widget} />;
      case WIDGET_KIND.local.notification:
        return <NotificationWidget key={widget.id} />;
      case WIDGET_KIND.local.network:
        return <NewsfeedWidget key={widget.id} />;
      default:
        return null;
    }
  }, []);

  if (status === 'pending') {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white dark:bg-black">
        <LoaderIcon className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <VList
      className="h-full w-full flex-nowrap overflow-x-auto !overflow-y-hidden scrollbar-none focus:outline-none"
      horizontal
      ref={ref}
      initialItemSize={420}
      tabIndex={0}
      onKeyDown={(e) => {
        if (!ref.current) return;
        switch (e.code) {
          case 'ArrowLeft': {
            e.preventDefault();
            const prevIndex = Math.max(selectedIndex - 1, 0);
            setSelectedIndex(prevIndex);
            ref.current.scrollToIndex(prevIndex, {
              align: 'center',
              smooth: true,
            });
            break;
          }
          case 'ArrowRight': {
            e.preventDefault();
            const nextIndex = Math.min(selectedIndex + 1, data.length - 1);
            setSelectedIndex(nextIndex);
            ref.current.scrollToIndex(nextIndex, {
              align: 'center',
              smooth: true,
            });
            break;
          }
        }
      }}
    >
      {data.map((widget) => renderItem(widget))}
      <ToggleWidgetList />
    </VList>
  );
}
