import { NoteBase } from '@components/note/base';
import { RelayContext } from '@components/relaysProvider';

import { relaysAtom } from '@stores/relays';

import { useAtomValue } from 'jotai';
import { Author } from 'nostr-relaypool';
import { useContext, useEffect, useState } from 'react';

export default function ProfileNotes({ id }: { id: string }) {
  const pool: any = useContext(RelayContext);
  const relays: any = useAtomValue(relaysAtom);

  const [data, setData] = useState([]);

  useEffect(() => {
    const user = new Author(pool, relays, id);
    user.text((res) => setData((data) => [...data, res]), 100, 0);
  }, [id, pool, relays]);

  return (
    <div className="flex flex-col">
      {data.map((item) => (
        <div key={item.id}>
          <NoteBase event={item} />
        </div>
      ))}
    </div>
  );
}
