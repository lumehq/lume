import { useProfile } from '@lume/utils/hooks/useProfile';
import { shortenKey } from '@lume/utils/shortenKey';

export const NoteMentionUser = ({ pubkey }: { pubkey: string }) => {
  const { user } = useProfile(pubkey);

  return <span className="cursor-pointer text-fuchsia-500">@{user?.username || user?.name || shortenKey(pubkey)}</span>;
};
