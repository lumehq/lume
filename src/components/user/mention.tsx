import { useMetadata } from '@utils/metadata';
import { truncate } from '@utils/truncate';

import { memo } from 'react';

export const UserMention = memo(function UserMention({ pubkey }: { pubkey: string }) {
  const profile = useMetadata(pubkey);

  return <span className="cursor-pointer text-fuchsia-500">@{profile?.name || truncate(pubkey, 16, ' .... ')}</span>;
});
