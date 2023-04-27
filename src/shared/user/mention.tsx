import { useProfile } from '@lume/utils/hooks/useProfile';
import { shortenKey } from '@lume/utils/shortenKey';

export const UserMention = ({ pubkey }: { pubkey: string }) => {
  const profile = useProfile(pubkey);
  return (
    <span className="cursor-pointer text-fuchsia-500">@{profile?.name || profile?.username || shortenKey(pubkey)}</span>
  );
};
