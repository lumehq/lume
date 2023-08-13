import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createWidget, getWidgets, removeWidget } from '@libs/storage';

import { Widget } from '@utils/types';

interface WidgetState {
  widgets: null | Array<Widget>;
  fetchWidgets: () => void;
  setWidget: ({ kind, title, content }: Widget) => void;
  removeWidget: (id: string) => void;
}

export const useWidgets = create<WidgetState>()(
  persist(
    (set) => ({
      widgets: null,
      fetchWidgets: async () => {
        const widgets = await getWidgets();
        set({ widgets: widgets });
      },
      setWidget: async ({ kind, title, content }: Widget) => {
        const widget: Widget = await createWidget(kind, title, content);
        set((state) => ({ widgets: [...state.widgets, widget] }));
      },
      removeWidget: async (id: string) => {
        await removeWidget(id);
        set((state) => ({ widgets: state.widgets.filter((widget) => widget.id !== id) }));
      },
    }),
    {
      name: 'blocks',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
