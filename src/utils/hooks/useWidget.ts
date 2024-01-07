import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useArk } from '@libs/ark';

import { Widget } from '@utils/types';

export function useWidget() {
  const { ark } = useArk();
  const queryClient = useQueryClient();

  const addWidget = useMutation({
    mutationFn: async (widget: Widget) => {
      return await ark.createWidget(widget.kind, widget.title, widget.content);
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
      await ark.removeWidget(currentId);
      const newWidget = await ark.createWidget(widget.kind, widget.title, widget.content);

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
      await ark.removeWidget(id);

      // Return a context object with the snapshotted value
      return { prevWidgets };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['widgets'] });
    },
  });

  const renameWidget = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['widgets'] });

      // Snapshot the previous value
      const prevWidgets = queryClient.getQueryData(['widgets']);

      // Optimistically update to the new value
      queryClient.setQueryData(['widgets'], (prev: Widget[]) =>
        prev.filter((t) => t.id !== id)
      );

      // Update in database
      await ark.renameWidget(id, title);

      // Return a context object with the snapshotted value
      return { prevWidgets };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['widgets'] });
    },
  });

  return { addWidget, replaceWidget, removeWidget, renameWidget };
}
