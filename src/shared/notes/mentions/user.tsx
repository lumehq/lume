import { useBlocks } from '@stores/blocks';
import { BLOCK_KINDS } from '@stores/constants';

import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export function MentionUser({ pubkey }: { pubkey: string }) {
  const { user } = useProfile(pubkey);
  const setBlock = useBlocks((state) => state.setBlock);

  return (
    <button
      type="button"
      onClick={() =>
        setBlock({
          kind: BLOCK_KINDS.user,
          title: user?.nip05 || user?.name || user?.displayNam,
          content: pubkey,
        })
      }
      className="break-words font-normal text-blue-400 no-underline hover:text-blue-500"
    >
      {user?.nip05 ||
        user?.name ||
        user?.display_name ||
        user?.username ||
        displayNpub(pubkey, 16)}
    </button>
  );
}
