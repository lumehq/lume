import { RelayContext } from '@components/relaysProvider';

import { truncate } from '@utils/truncate';

import { Author } from 'nostr-relaypool';
import { memo, useContext, useEffect, useMemo, useState } from 'react';

export const UserMention = memo(function UserMention({ pubkey }: { pubkey: string }) {
  const [pool, relays]: any = useContext(RelayContext);

  const [profile, setProfile] = useState(null);
  const user = useMemo(() => new Author(pool, relays, pubkey), [pubkey, pool, relays]);

  useEffect(() => {
    user.metaData((res) => setProfile(JSON.parse(res.content)), 0);
  }, [user]);

  return <span className="cursor-pointer text-fuchsia-500">@{profile?.name || truncate(pubkey, 16, ' .... ')}</span>;
});
