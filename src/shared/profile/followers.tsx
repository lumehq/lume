import { RelayContext } from '@lume/shared/relaysProvider';
import { UserFollow } from '@lume/shared/user/follow';
import { READONLY_RELAYS } from '@lume/stores/constants';

import destr from 'destr';
import { Author } from 'nostr-relaypool';
import { useContext, useEffect, useState } from 'react';

export default function ProfileFollowers({ id }: { id: string }) {
  const pool: any = useContext(RelayContext);
  const [followers, setFollowers] = useState(null);

  useEffect(() => {
    const user = new Author(pool, READONLY_RELAYS, id);
    user.followers((res) => setFollowers(destr(res.tags)), 0, 100);
  }, [id, pool]);

  return (
    <div className="flex flex-col gap-3 px-3 py-5">
      {followers && followers.map((follower) => <UserFollow key={follower[1]} pubkey={follower[1]} />)}
    </div>
  );
}
