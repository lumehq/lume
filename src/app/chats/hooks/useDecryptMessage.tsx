import { NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';
import { useEffect, useState } from 'react';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

export function useDecryptMessage(message: NDKEvent) {
  const { db } = useStorage();
  const { ndk } = useNDK();

  const [content, setContent] = useState(message.content);

  useEffect(() => {
    async function decryptContent() {
      try {
        const sender = new NDKUser({
          pubkey:
            db.account.pubkey === message.pubkey
              ? message.tags.find((el) => el[0] === 'p')[1]
              : message.pubkey,
        });
        const result = await ndk.signer.decrypt(sender, message.content);
        setContent(result);
      } catch (e) {
        console.error(e);
      }
    }

    decryptContent();
  }, []);

  return content;
}
