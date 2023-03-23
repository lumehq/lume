import { RelayContext } from '@components/contexts/relay';

import useLocalStorage from '@rehooks/local-storage';
import destr from 'destr';
import { Author } from 'nostr-relaypool';
import { useContext, useEffect, useState } from 'react';

export default function ProfileFollowers({ id }: { id: string }) {
  const relayPool: any = useContext(RelayContext);
  const [relays]: any = useLocalStorage('relays');

  const [followers, setFollowers] = useState(null);

  useEffect(() => {
    const user = new Author(relayPool, relays, id);
    user.followers((res) => setFollowers(destr(res.tags)), 0, 100);
  }, [id, relayPool, relays]);

  return (
    <div className="flex flex-col gap-3 py-5">
      {followers && followers.map((follower, index) => <p key={index}>{follower[1]}</p>)}
    </div>
  );
}
