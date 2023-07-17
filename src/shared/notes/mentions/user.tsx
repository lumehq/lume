import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createBlock } from '@libs/storage';

import { BLOCK_KINDS } from '@stores/constants';

import { useProfile } from '@utils/hooks/useProfile';
import { shortenKey } from '@utils/shortenKey';

export function MentionUser({ pubkey }: { pubkey: string }) {
  const { user } = useProfile(pubkey);

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
      kind: BLOCK_KINDS.user,
      title: user?.name || user?.displayNam,
      content: pubkey,
    });
  };

  return (
    <button
      type="button"
      onClick={() => openBlock()}
      className="break-words rounded bg-zinc-800 px-2 py-px text-sm font-normal text-blue-400 no-underline hover:bg-zinc-700 hover:text-blue-500"
    >
      {'@' + user?.name || user?.displayName || shortenKey(pubkey)}
    </button>
  );
}
