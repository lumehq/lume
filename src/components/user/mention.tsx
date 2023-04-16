import { useProfileMetadata } from '@utils/hooks/useProfileMetadata';
import { truncate } from '@utils/truncate';

export const UserMention = ({ pubkey }: { pubkey: string }) => {
  const profile = useProfileMetadata(pubkey);
  return (
    <span className="cursor-pointer text-fuchsia-500">
      @{profile?.name || profile?.username || truncate(pubkey, 16, ' .... ')}
    </span>
  );
};
