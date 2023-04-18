import { useProfileMetadata } from '@utils/hooks/useProfileMetadata';
import { shortenKey } from '@utils/shortenKey';

export const UserMention = ({ pubkey }: { pubkey: string }) => {
  const profile = useProfileMetadata(pubkey);
  return (
    <span className="cursor-pointer text-fuchsia-500">@{profile?.name || profile?.username || shortenKey(pubkey)}</span>
  );
};
