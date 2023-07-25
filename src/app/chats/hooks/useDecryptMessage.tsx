import { nip04 } from 'nostr-tools';
import { useEffect, useState } from 'react';

export function useDecryptMessage(data: any, userPubkey: string, userPriv: string) {
  const [content, setContent] = useState(data.content);

  useEffect(() => {
    async function decrypt() {
      const pubkey =
        userPubkey === data.sender_pubkey ? data.receiver_pubkey : data.sender_pubkey;
      const result = await nip04.decrypt(userPriv, pubkey, data.content);
      setContent(result);
    }

    decrypt().catch(console.error);
  }, []);

  return content;
}
