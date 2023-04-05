import { RelayContext } from '@components/relaysProvider';

import { truncate } from '@utils/truncate';

import { Author } from 'nostr-relaypool';
import { memo, useContext, useEffect, useState } from 'react';

export const UserMention = memo(function UserMention({ pubkey }: { pubkey: string }) {
  const [pool, relays]: any = useContext(RelayContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const user = new Author(pool, relays, pubkey);
    user.metaData((res) => setProfile(JSON.parse(res.content)), 0);
  }, [pool, relays, pubkey]);

  return <span className="cursor-pointer text-fuchsia-500">@{profile?.name || truncate(pubkey, 16, ' .... ')}</span>;
});
