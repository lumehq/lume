import { RelayContext } from '@components/contexts/relay';
import { Content } from '@components/note/content';

import useLocalStorage from '@rehooks/local-storage';
import { Author } from 'nostr-relaypool';
import { useContext, useEffect, useState } from 'react';

export default function ProfileNotes({ id }: { id: string }) {
  const relayPool: any = useContext(RelayContext);
  const [relays]: any = useLocalStorage('relays');

  const [data, setData] = useState([]);

  useEffect(() => {
    const user = new Author(relayPool, relays, id);
    user.text((res) => setData((data) => [...data, res]), 0, 100);
  }, [id, relayPool, relays]);

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
