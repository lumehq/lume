import { Content } from '@components/note/content';
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
    user.text((res) => setData((data) => [...data, res]), 0, 100);
  }, [id, pool, relays]);

  return (
    <div className="flex flex-col">
      {data.map((item) => (
        <div
          key={item.id}
          className="flex h-min min-h-min w-full select-text flex-col border-b border-zinc-800 px-3 py-5 hover:bg-black/20"
        >
          <Content data={item} />
        </div>
      ))}
    </div>
  );
}
