import { BLOCK_KINDS } from '@stores/constants';

import { useBlock } from '@utils/hooks/useBlock';
import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

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
      className="break-words font-normal text-blue-400 no-underline hover:text-blue-500"
    >
      {'@' + user?.name || user?.displayName || displayNpub(pubkey, 16)}
    </button>
  );
}
