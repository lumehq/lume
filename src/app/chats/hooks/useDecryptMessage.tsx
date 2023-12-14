import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useEffect, useState } from 'react';
import { useArk } from '@libs/ark';

export function useDecryptMessage(event: NDKEvent) {
  const ark = useArk();
  const [content, setContent] = useState(event.content);

  useEffect(() => {
    async function decryptContent() {
      try {
        const message = await ark.nip04Decrypt({ event });
        setContent(message);
      } catch (e) {
        console.error(e);
      }
    }

    decryptContent();
  }, []);

  return content;
}
