import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createBlock } from '@libs/storage';

import { BLOCK_KINDS } from '@stores/constants';

export function Hashtag({ tag }: { tag: string }) {
  const queryClient = useQueryClient();

  const block = useMutation({
    mutationFn: (data: { kind: number; title: string; content: string }) => {
      return createBlock(data.kind, data.title, data.content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocks'] });
    },
  });

  const openBlock = () => {
    block.mutate({
      kind: BLOCK_KINDS.hashtag,
      title: tag,
      content: tag.replace('#', ''),
    });
  };

  return (
    <button
      type="button"
      onClick={() => openBlock()}
      className="rounded bg-zinc-800 px-2 py-px text-sm font-normal text-orange-400 no-underline hover:bg-zinc-700 hover:text-orange-500"
    >
      {tag}
    </button>
  );
}
