import { useQuery } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { VList, VListHandle } from 'virtua';
import { useArk } from '@libs/ark';
import { LoaderIcon } from '@shared/icons';
import {
  ArticleWidget,
  FileWidget,
  GroupWidget,
  HashtagWidget,
  NewsfeedWidget,
  NotificationWidget,
  ThreadWidget,
  ToggleWidgetList,
  TopicWidget,
  TrendingAccountsWidget,
  TrendingNotesWidget,
  UserWidget,
  WidgetList,
} from '@shared/widgets';
import { WIDGET_KIND } from '@utils/constants';
import { Widget } from '@utils/types';

export function HomeScreen() {
  const ref = useRef<VListHandle>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const ark = useArk();
  const { status, data } = useQuery({
    queryKey: ['widgets'],
    queryFn: async () => {
      const dbWidgets = await ark.getWidgets();
      const defaultWidgets = [
        {
          id: '9999',
          title: 'Newsfeed',
          content: '',
          kind: WIDGET_KIND.newsfeed,
        },
        {
          id: '9998',
          title: 'Notification',
          content: '',
          kind: WIDGET_KIND.notification,
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
      case WIDGET_KIND.notification:
        return <NotificationWidget key={widget.id} />;
      case WIDGET_KIND.newsfeed:
        return <NewsfeedWidget key={widget.id} />;
      case WIDGET_KIND.topic:
        return <TopicWidget key={widget.id} widget={widget} />;
      case WIDGET_KIND.user:
        return <UserWidget key={widget.id} widget={widget} />;
      case WIDGET_KIND.thread:
        return <ThreadWidget key={widget.id} widget={widget} />;
      case WIDGET_KIND.article:
        return <ArticleWidget key={widget.id} widget={widget} />;
      case WIDGET_KIND.file:
        return <FileWidget key={widget.id} widget={widget} />;
      case WIDGET_KIND.hashtag:
        return <HashtagWidget key={widget.id} widget={widget} />;
      case WIDGET_KIND.group:
        return <GroupWidget key={widget.id} widget={widget} />;
      case WIDGET_KIND.trendingNotes:
        return <TrendingNotesWidget key={widget.id} widget={widget} />;
      case WIDGET_KIND.trendingAccounts:
        return <TrendingAccountsWidget key={widget.id} widget={widget} />;
      case WIDGET_KIND.list:
        return <WidgetList key={widget.id} widget={widget} />;
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
    <div className="h-full w-full">
      <VList
        ref={ref}
        className="h-full w-full flex-nowrap overflow-x-auto !overflow-y-hidden scrollbar-none focus:outline-none"
        initialItemSize={420}
        tabIndex={0}
        horizontal
        onKeyDown={(e) => {
          if (!ref.current) return;
          switch (e.code) {
            case 'ArrowUp':
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
            case 'ArrowDown':
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
            default:
              break;
          }
        }}
      >
        {data.map((widget) => renderItem(widget))}
        <ToggleWidgetList />
      </VList>
    </div>
  );
}
