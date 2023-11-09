import { useCallback } from 'react';

import {
  ArticleIcon,
  BellIcon,
  FileIcon,
  FollowsIcon,
  GroupFeedsIcon,
  HashtagIcon,
  ThreadsIcon,
  TrendingIcon,
} from '@shared/icons';
import { TitleBar } from '@shared/titleBar';
import { WidgetWrapper } from '@shared/widgets';

import { DEFAULT_WIDGETS, WIDGET_KIND } from '@stores/constants';

import { useWidget } from '@utils/hooks/useWidget';
import { Widget, WidgetGroup, WidgetGroupItem } from '@utils/types';

export function WidgetList({ params }: { params: Widget }) {
  const { addWidget, removeWidget } = useWidget();

  const open = (item: WidgetGroupItem) => {
    addWidget.mutate({
      kind: item.kind,
      title: item.title,
      content: JSON.stringify(item.content),
    });
    removeWidget.mutate(params.id);
  };

  const renderIcon = useCallback((kind: number) => {
    switch (kind) {
      case WIDGET_KIND.tmp.xfeed:
        return (
          <GroupFeedsIcon className="h-5 w-5 text-neutral-900 dark:text-neutral-100" />
        );
      case WIDGET_KIND.local.follows:
        return <FollowsIcon className="h-5 w-5 text-neutral-900 dark:text-neutral-100" />;
      case WIDGET_KIND.local.files:
      case WIDGET_KIND.global.files:
        return <FileIcon className="h-5 w-5 text-neutral-900 dark:text-neutral-100" />;
      case WIDGET_KIND.local.articles:
      case WIDGET_KIND.global.articles:
        return <ArticleIcon className="h-5 w-5 text-neutral-900 dark:text-neutral-100" />;
      case WIDGET_KIND.tmp.xhashtag:
        return <HashtagIcon className="h-5 w-5 text-neutral-900 dark:text-neutral-100" />;
      case WIDGET_KIND.nostrBand.trendingAccounts:
      case WIDGET_KIND.nostrBand.trendingNotes:
        return (
          <TrendingIcon className="h-5 w-5 text-neutral-900 dark:text-neutral-100" />
        );
      case WIDGET_KIND.local.notification:
        return <BellIcon className="h-5 w-5 text-neutral-900 dark:text-neutral-100" />;
      case WIDGET_KIND.other.learnNostr:
        return <ThreadsIcon className="h-5 w-5 text-neutral-900 dark:text-neutral-100" />;
      default:
        return null;
    }
  }, []);

  const renderItem = useCallback((row: WidgetGroup, index: number) => {
    return (
      <div key={index} className="flex flex-col gap-2">
        <h3 className="font-semibold">{row.title}</h3>
        <div className="flex flex-col divide-y divide-neutral-200 overflow-hidden rounded-xl bg-neutral-100 dark:divide-neutral-800 dark:bg-neutral-900">
          {row.data.map((item, index) => (
            <button
              onClick={() => open(item)}
              key={index}
              className="group flex items-center gap-2.5 px-4 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            >
              {item.icon ? (
                <div className="h-10 w-10 shrink-0 rounded-lg">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="h-10 w-10 object-cover"
                  />
                </div>
              ) : (
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-200 group-hover:bg-neutral-300 dark:bg-neutral-800 dark:group-hover:bg-neutral-700">
                  {renderIcon(item.kind)}
                </div>
              )}
              <div className="inline-flex h-16 w-full flex-col items-start justify-center">
                <h5 className="line-clamp-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {item.title}
                </h5>
                <p className="line-clamp-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }, []);

  return (
    <WidgetWrapper>
      <TitleBar id={params.id} title="Add widget" />
      <div className="flex-1 overflow-y-auto pb-10 scrollbar-none">
        <div className="flex flex-col gap-6 px-3">
          {DEFAULT_WIDGETS.map((row: WidgetGroup, index: number) =>
            renderItem(row, index)
          )}
          <div className="border-t border-neutral-200 pt-6 dark:border-neutral-800">
            <button
              type="button"
              disabled
              className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-neutral-50 text-sm font-medium text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100"
            >
              Build your own widget{' '}
              <div className="-rotate-3 transform-gpu rounded-md border border-neutral-200 bg-neutral-100 px-1.5 py-1 dark:border-neutral-800 dark:bg-neutral-900">
                <span className="bg-gradient-to-r from-blue-400 via-red-400 to-orange-500 bg-clip-text text-xs text-transparent dark:from-blue-200 dark:via-red-200 dark:to-orange-300">
                  Coming soon
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </WidgetWrapper>
  );
}
