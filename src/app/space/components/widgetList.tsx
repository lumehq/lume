import { useCallback } from 'react';

import { useStorage } from '@libs/storage/provider';

import {
  ArticleIcon,
  FileIcon,
  FollowsIcon,
  GroupFeedsIcon,
  HashtagIcon,
  ThreadsIcon,
  TrendingIcon,
} from '@shared/icons';
import { TitleBar } from '@shared/titleBar';

import { DefaultWidgets, WidgetKinds, useWidgets } from '@stores/widgets';

import { Widget, WidgetGroup, WidgetGroupItem } from '@utils/types';

export function WidgetList({ params }: { params: Widget }) {
  const { db } = useStorage();
  const [setWidget, removeWidget] = useWidgets((state) => [
    state.setWidget,
    state.removeWidget,
  ]);

  const openWidget = (widget: WidgetGroupItem) => {
    setWidget(db, { kind: widget.kind, title: widget.title, content: '' });
    removeWidget(db, params.id);
  };

  const renderIcon = useCallback(
    (kind: number) => {
      switch (kind) {
        case WidgetKinds.tmp.xfeed:
          return <GroupFeedsIcon className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />;
        case WidgetKinds.local.follows:
          return <FollowsIcon className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />;
        case WidgetKinds.local.files:
        case WidgetKinds.global.files:
          return <FileIcon className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />;
        case WidgetKinds.local.articles:
        case WidgetKinds.global.articles:
          return <ArticleIcon className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />;
        case WidgetKinds.tmp.xhashtag:
          return <HashtagIcon className="h-5 w-4 text-zinc-900 dark:text-zinc-100" />;
        case WidgetKinds.nostrBand.trendingAccounts:
        case WidgetKinds.nostrBand.trendingNotes:
          return <TrendingIcon className="h-5 w-4 text-zinc-900 dark:text-zinc-100" />;
        case WidgetKinds.other.learnNostr:
          return <ThreadsIcon className="h-5 w-4 text-zinc-900 dark:text-zinc-100" />;
        default:
          return null;
      }
    },
    [DefaultWidgets]
  );

  const renderItem = useCallback(
    (row: WidgetGroup, index: number) => {
      return (
        <div key={index} className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-300">
            {row.title}
          </h3>
          <div className="flex flex-col divide-y divide-zinc-200 overflow-hidden rounded-xl bg-zinc-100 dark:divide-zinc-800 dark:bg-zinc-900">
            {row.data.map((item, index) => (
              <button
                onClick={() => openWidget(item)}
                key={index}
                className="group flex items-center gap-2.5 px-4 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                {item.icon ? (
                  <div className="h-10 w-10 shrink-0 rounded-md">
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="h-10 w-10 object-cover"
                    />
                  </div>
                ) : (
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-zinc-200 group-hover:bg-zinc-300 dark:bg-zinc-800 dark:group-hover:bg-zinc-700">
                    {renderIcon(item.kind)}
                  </div>
                )}
                <div className="inline-flex h-16 w-full flex-col items-start justify-center">
                  <h5 className="line-clamp-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {item.title}
                  </h5>
                  <p className="line-clamp-1 text-xs text-zinc-500 dark:text-zinc-300">
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    },
    [DefaultWidgets]
  );

  return (
    <div className="relative h-full shrink-0 grow-0 basis-[400px]">
      <TitleBar id={params.id} title="Add widget" />
      <div className="scrollbar-hide h-full overflow-y-auto pb-20">
        <div className="flex flex-col gap-6 px-3">
          {DefaultWidgets.map((row: WidgetGroup, index: number) =>
            renderItem(row, index)
          )}
          <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <button
              type="button"
              disabled
              className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-zinc-100 text-sm font-medium text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
            >
              Build your own widget{' '}
              <div className="-rotate-3 transform-gpu rounded-md border border-zinc-300 bg-zinc-200 px-1.5 py-1 dark:border-zinc-700 dark:bg-zinc-800">
                <span className="bg-gradient-to-t from-fuchsia-200 via-red-200 to-orange-300 bg-clip-text text-xs text-transparent">
                  Coming soon
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
