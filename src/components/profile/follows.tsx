import { RelayContext } from '@components/relaysProvider';
import { UserFollow } from '@components/user/follow';

import { Author } from 'nostr-relaypool';
import { useContext, useEffect, useState } from 'react';

export default function ProfileFollows({ id }: { id: string }) {
  const [pool, relays]: any = useContext(RelayContext);
  const [follows, setFollows] = useState(null);

  useEffect(() => {
    const user = new Author(pool, relays, id);
    user.follows((res) => setFollows(res), 0);
  }, [id, pool, relays]);

  return (
    <div className="flex flex-col gap-3 px-3 py-5">
      {follows && follows.map((follow) => <UserFollow key={follow.pubkey} pubkey={follow.pubkey} />)}
    </div>
  );
}
