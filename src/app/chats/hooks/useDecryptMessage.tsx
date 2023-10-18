import { NDKEvent } from '@nostr-dev-kit/ndk';
import { nip04 } from 'nostr-tools';
import { useEffect, useState } from 'react';

import { useStorage } from '@libs/storage/provider';

export function useDecryptMessage(message: NDKEvent) {
  const { db } = useStorage();
  const [content, setContent] = useState(message.content);

  useEffect(() => {
    async function decryptContent() {
      try {
        const privkey = await db.secureLoad(db.account.pubkey);
        const sender =
          db.account.pubkey === message.pubkey
            ? message.tags.find((el) => el[0] === 'p')[1]
            : message.pubkey;
        const result = await nip04.decrypt(privkey, sender, message.content);
        setContent(result);
      } catch (e) {
        console.error(e);
      }
    }

    decryptContent();
  }, []);

  return content;
}
