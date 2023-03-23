import { RelayContext } from '@components/contexts/relay';

import useLocalStorage from '@rehooks/local-storage';
import { Author } from 'nostr-relaypool';
import { useContext, useEffect, useState } from 'react';

export default function ProfileFollows({ id }: { id: string }) {
  const relayPool: any = useContext(RelayContext);
  const [relays]: any = useLocalStorage('relays');

  const [follows, setFollows] = useState(null);

  useEffect(() => {
    const user = new Author(relayPool, relays, id);
    user.follows((res) => setFollows(res), 0);
  }, [id, relayPool, relays]);

  return (
    <div className="flex flex-col gap-3 py-5">
      {follows && follows.map((follow, index) => <p key={index}>{follow.pubkey}</p>)}
    </div>
  );
}
