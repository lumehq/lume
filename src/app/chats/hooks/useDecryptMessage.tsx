import { NDKEvent } from '@nostr-dev-kit/ndk';
import { nip04 } from 'nostr-tools';
import { useEffect, useState } from 'react';

export function useDecryptMessage(
  message: NDKEvent,
  userPubkey: string,
  userPriv: string
) {
  const [content, setContent] = useState(message.content);

  useEffect(() => {
    async function decrypt() {
      const pubkey =
        userPubkey === message.pubkey
          ? message.tags.find((el) => el[0] === 'p')[1]
          : message.pubkey;
      const result = await nip04.decrypt(userPriv, pubkey, message.content);
      setContent(result);
    }

    decrypt().catch(console.error);
  }, []);

  return content;
}
