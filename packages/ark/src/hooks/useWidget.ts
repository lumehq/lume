import { type WidgetProps } from '@lume/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useStorage } from '../provider';

export function useWidget() {
  const storage = useStorage();
  const queryClient = useQueryClient();

  const addWidget = useMutation({
    mutationFn: async (widget: WidgetProps) => {
      return await storage.createWidget(widget.kind, widget.title, widget.content);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['widgets'], (old: WidgetProps[]) => [...old, data]);
    },
  });

  const replaceWidget = useMutation({
    mutationFn: async ({
      currentId,
      widget,
    }: {
      currentId: string;
      widget: WidgetProps;
    }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['widgets'] });

      // Snapshot the previous value
      const prevWidgets = queryClient.getQueryData(['widgets']);

      // create new widget
      await storage.removeWidget(currentId);
      const newWidget = await storage.createWidget(
        widget.kind,
        widget.title,
        widget.content
      );

      // Optimistically update to the new value
      queryClient.setQueryData(['widgets'], (prev: WidgetProps[]) => [
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
      queryClient.setQueryData(['widgets'], (prev: WidgetProps[]) =>
        prev.filter((t) => t.id !== id)
      );

      // Update in database
      await storage.removeWidget(id);

      // Return a context object with the snapshotted value
      return { prevWidgets };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['widgets'] });
    },
  });

  return { addWidget, replaceWidget, removeWidget };
}
