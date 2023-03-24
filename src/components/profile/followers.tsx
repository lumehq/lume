import { RelayContext } from '@components/relaysProvider';

import { relaysAtom } from '@stores/relays';

import destr from 'destr';
import { useAtomValue } from 'jotai';
import { Author } from 'nostr-relaypool';
import { useContext, useEffect, useState } from 'react';

export default function ProfileFollowers({ id }: { id: string }) {
  const pool: any = useContext(RelayContext);
  const relays: any = useAtomValue(relaysAtom);

  const [followers, setFollowers] = useState(null);

  useEffect(() => {
    const user = new Author(pool, relays, id);
    user.followers((res) => setFollowers(destr(res.tags)), 0, 100);
  }, [id, pool, relays]);

  return (
    <div className="flex flex-col gap-3 py-5">
      {followers && followers.map((follower, index) => <p key={index}>{follower[1]}</p>)}
    </div>
  );
}
