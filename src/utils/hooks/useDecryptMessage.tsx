import { nip04 } from 'nostr-tools';
import { useCallback, useEffect, useState } from 'react';

export const useDecryptMessage = (userKey: string, userPriv: string, data: any) => {
  const [content, setContent] = useState(null);

  const extractSenderKey = useCallback(() => {
    const keyInTags = data.tags.find(([k, v]) => k === 'p' && v && v !== '')[1];
    if (keyInTags === userKey) {
      return data.pubkey;
    } else {
      return keyInTags;
    }
  }, [data.pubkey, data.tags, userKey]);

  const decrypt = useCallback(async () => {
    const senderKey = extractSenderKey();
    const result = await nip04.decrypt(userPriv, senderKey, data.content);
    // update state with decrypt content
    setContent(result);
  }, [extractSenderKey, userPriv, data.content]);

  useEffect(() => {
    decrypt().catch(console.error);
  }, [decrypt]);

  return content ? content : null;
};
