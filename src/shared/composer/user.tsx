import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export function ComposerUser({ pubkey }: { pubkey: string }) {
  const { user } = useProfile(pubkey);

  return (
    <div className="flex items-center gap-3">
      <img
        src={user?.picture || user?.image}
        alt={pubkey}
        className="h-10 w-10 shrink-0 rounded-lg"
      />
      <h5 className="font-medium text-neutral-900 dark:text-neutral-100">
        {user?.display_name || user?.name || user?.displayName || displayNpub(pubkey, 16)}
      </h5>
    </div>
  );
}
