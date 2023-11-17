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

  const replaceWidget = useMutation({
    mutationFn: async ({ currentId, widget }: { currentId: string; widget: Widget }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['widgets'] });

      // Snapshot the previous value
      const prevWidgets = queryClient.getQueryData(['widgets']);

      // create new widget
      await db.removeWidget(currentId);
      const newWidget = await db.createWidget(widget.kind, widget.title, widget.content);

      // Optimistically update to the new value
      queryClient.setQueryData(['widgets'], (prev: Widget[]) => [
        ...prev.filter((t) => t.id !== currentId),
        newWidget,
      ]);

      // Return a context object with the snapshotted value
      return { prevWidgets };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['widgets'] });
    },
  });

  const removeWidget = useMutation({
    mutationFn: async (id: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['widgets'] });

      // Snapshot the previous value
      const prevWidgets = queryClient.getQueryData(['widgets']);

      // Optimistically update to the new value
      queryClient.setQueryData(['widgets'], (prev: Widget[]) =>
        prev.filter((t) => t.id !== id)
      );

      // Update in database
      await db.removeWidget(id);

      // Return a context object with the snapshotted value
      return { prevWidgets };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['widgets'] });
    },
  });

  return { addWidget, replaceWidget, removeWidget };
}
