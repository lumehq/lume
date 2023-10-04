import { NDKEvent } from '@nostr-dev-kit/ndk';
import { nip04 } from 'nostr-tools';
import { useEffect, useState } from 'react';

export function useDecryptMessage(message: NDKEvent, pubkey: string, privkey: string) {
  const [content, setContent] = useState(message.content);

  useEffect(() => {
    async function decryptContent() {
      try {
        const sender =
          pubkey === message.pubkey
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
