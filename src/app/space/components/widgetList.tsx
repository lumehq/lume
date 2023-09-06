import { useCallback } from 'react';

import { useStorage } from '@libs/storage/provider';

import {
  ArticleIcon,
  FileIcon,
  FollowsIcon,
  GroupFeedsIcon,
  HashtagIcon,
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
          return <GroupFeedsIcon className="h-5 w-5 text-white" />;
        case WidgetKinds.local.follows:
          return <FollowsIcon className="h-5 w-5 text-white" />;
        case WidgetKinds.local.files:
        case WidgetKinds.global.files:
          return <FileIcon className="h-5 w-5 text-white" />;
        case WidgetKinds.local.articles:
        case WidgetKinds.global.articles:
          return <ArticleIcon className="h-5 w-5 text-white" />;
        case WidgetKinds.tmp.xhashtag:
          return <HashtagIcon className="h-5 w-4 text-white" />;
        case WidgetKinds.nostrBand.trendingAccounts:
        case WidgetKinds.nostrBand.trendingNotes:
          return <TrendingIcon className="h-5 w-4 text-white" />;
        default:
          return '';
      }
    },
    [DefaultWidgets]
  );

  const renderItem = useCallback(
    (row: WidgetGroup) => {
      return (
        <div className="flex flex-col gap-3">
          <h3 className="font-medium text-white/50">{row.title}</h3>
          <div className="flex flex-col divide-y divide-white/5 overflow-hidden rounded-xl bg-white/10">
            {row.data.map((item, index) => (
              <button
                onClick={() => openWidget(item)}
                key={index}
                className="flex items-center gap-2.5 px-4 hover:bg-white/10"
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
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/10">
                    {renderIcon(item.kind)}
                  </div>
                )}
                <div className="inline-flex h-16 w-full flex-col items-start justify-center gap-1">
                  <h5 className="line-clamp-1 font-medium leading-none">{item.title}</h5>
                  <p className="line-clamp-1 text-xs leading-none text-white/50">
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
    <div className="relative h-full shrink-0 grow-0 basis-[400px] overflow-hidden bg-white/10">
      <TitleBar id={params.id} title="Add widget" />
      <div className="flex flex-col gap-6 px-3">
        {DefaultWidgets.map((row: WidgetGroup) => renderItem(row))}
      </div>
      <div className="mt-6 px-3">
        <div className="border-t border-white/5 pt-6">
          <button
            type="button"
            disabled
            className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-white/5 text-sm font-medium text-white/50"
          >
            Build your own widget{' '}
            <div className="-rotate-3 transform rounded-md border border-white/20 bg-white/10 px-1.5 py-1">
              <span className="bg-gradient-to-t from-fuchsia-200 via-red-200 to-orange-300 bg-clip-text text-xs text-transparent">
                Coming soon
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
