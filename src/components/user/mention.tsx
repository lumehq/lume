import { useMetadata } from '@utils/metadata';
import { truncate } from '@utils/truncate';

export const UserMention = ({ pubkey }: { pubkey: string }) => {
  const profile = useMetadata(pubkey);
  return (
    <span className="cursor-pointer text-fuchsia-500">
      @{profile?.name || profile?.username || truncate(pubkey, 16, ' .... ')}
    </span>
  );
};
