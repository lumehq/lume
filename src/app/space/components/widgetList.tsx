import { useCallback } from 'react';

import { useStorage } from '@libs/storage/provider';

import { TitleBar } from '@shared/titleBar';

import { DefaultWidgets, useWidgets } from '@stores/widgets';

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

  const renderItem = useCallback(
    (row: WidgetGroup) => {
      return (
        <div className="flex flex-col gap-3">
          <h3 className="font-medium text-white/50">{row.title}</h3>
          <div className="flex flex-col divide-y divide-white/5 overflow-hidden rounded-xl bg-white/10">
            {row.data.map((item, index) => (
              <button onClick={() => openWidget(item)} key={index}>
                <div className="inline-flex h-14 w-full flex-col items-start justify-center gap-1 px-4 hover:bg-white/10">
                  <h5 className="font-medium leading-none">{item.title}</h5>
                  <p className="text-xs leading-none text-white/50">{item.description}</p>
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
      <div className="flex flex-col gap-8 px-3">
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
            <div className="-rotate-3 transform rounded-md bg-white/10 px-1.5 py-1">
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
