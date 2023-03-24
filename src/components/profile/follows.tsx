import { RelayContext } from '@components/relaysProvider';

import { relaysAtom } from '@stores/relays';

import { useAtomValue } from 'jotai';
import { Author } from 'nostr-relaypool';
import { useContext, useEffect, useState } from 'react';

export default function ProfileFollows({ id }: { id: string }) {
  const pool: any = useContext(RelayContext);
  const relays: any = useAtomValue(relaysAtom);

  const [follows, setFollows] = useState(null);

  useEffect(() => {
    const user = new Author(pool, relays, id);
    user.follows((res) => setFollows(res), 0);
  }, [id, pool, relays]);

  return (
    <div className="flex flex-col gap-3 py-5">
      {follows && follows.map((follow, index) => <p key={index}>{follow.pubkey}</p>)}
    </div>
  );
}
