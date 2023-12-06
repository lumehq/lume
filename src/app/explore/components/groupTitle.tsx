import { memo } from 'react';

import { useProfile } from '@utils/hooks/useProfile';

export const GroupTitle = memo(function GroupTitle({ pubkey }: { pubkey: string }) {
  const { isLoading, user } = useProfile(pubkey);

  if (isLoading) {
    return <div className="h-3 w-24 animate-pulse rounded bg-white/10" />;
  }

  return (
    <h3 className="text-sm font-semibold text-blue-500">{`${
      user.name || user.display_name
    }'s network`}</h3>
  );
});
