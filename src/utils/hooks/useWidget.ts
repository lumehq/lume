import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useStorage } from '@libs/storage/provider';

import { Widget } from '@utils/types';

export function useWidget() {
  const { db } = useStorage();
  const queryClient = useQueryClient();

  const addWidget = useMutation({
    mutationFn: async (widget: Widget) => {
      return await db.createWidget(widget.kind, widget.title, widget.content);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['widgets'], (old: Widget[]) => [...old, data]);
    },
  });

  const removeWidget = useMutation({
    mutationFn: async (id: string) => {
      return await db.removeWidget(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['widgets'] });
    },
  });

  return { addWidget, removeWidget };
}
