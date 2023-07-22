import { BLOCK_KINDS } from '@stores/constants';

import { useBlock } from '@utils/hooks/useBlock';
import { useProfile } from '@utils/hooks/useProfile';
import { shortenKey } from '@utils/shortenKey';

export function MentionUser({ pubkey }: { pubkey: string }) {
  const { add } = useBlock();
  const { user } = useProfile(pubkey);

  return (
    <button
      type="button"
      onClick={() =>
        add.mutate({
          kind: BLOCK_KINDS.user,
          title: user?.nip05 || user?.name || user?.displayNam,
          content: pubkey,
        })
      }
      className="break-words rounded bg-zinc-800 px-2 py-px text-sm font-normal text-blue-400 no-underline hover:bg-zinc-700 hover:text-blue-500"
    >
      {'@' + user?.name || user?.displayName || shortenKey(pubkey)}
    </button>
  );
}
