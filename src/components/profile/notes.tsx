'use client';

import { NoteBase } from '@components/note/base';
import { RelayContext } from '@components/relaysProvider';

import { Author } from 'nostr-relaypool';
import { useContext, useEffect, useState } from 'react';

export default function ProfileNotes({ id }: { id: string }) {
  const [pool, relays]: any = useContext(RelayContext);
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
