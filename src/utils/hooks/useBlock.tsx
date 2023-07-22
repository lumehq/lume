import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createBlock, removeBlock } from '@libs/storage';

interface BlockData {
  kind: number;
  title: string;
  content: string;
}

export function useBlock() {
  const queryClient = useQueryClient();

  const add = useMutation({
    mutationFn: (data: BlockData) => {
      return createBlock(data.kind, data.title, data.content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocks'] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => {
      return removeBlock(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocks'] });
    },
  });

  return { add, remove };
}
