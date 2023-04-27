import { NoteBase } from '@lume/shared/note/base';
import { RelayContext } from '@lume/shared/relaysProvider';
import { READONLY_RELAYS } from '@lume/stores/constants';

import { Author } from 'nostr-relaypool';
import { useContext, useEffect, useState } from 'react';

export default function ProfileNotes({ id }: { id: string }) {
  const pool: any = useContext(RelayContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    const user = new Author(pool, READONLY_RELAYS, id);
    user.text((res) => setData((data) => [...data, res]), 100, 0);
  }, [id, pool]);

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
