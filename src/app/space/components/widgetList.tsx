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
          <div className="grid grid-cols-3 gap-6">
            {row.data.map((item, index) => (
              <button onClick={() => openWidget(item)} key={index}>
                <div className="inline-flex aspect-square h-full w-full transform-gpu flex-col items-center justify-center gap-2.5 rounded-2xl bg-white/5 hover:bg-white/10">
                  <h5 className="text-sm font-medium">{item.title}</h5>
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
    <div className="relative h-full shrink-0 grow-0 basis-[400px] overflow-hidden">
      <TitleBar id={params.id} title="Add widget" />
      <div className="flex flex-col gap-8 px-3">
        {DefaultWidgets.map((row: WidgetGroup) => renderItem(row))}
      </div>
    </div>
  );
}
