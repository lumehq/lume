import { nip04 } from 'nostr-tools';
import { useCallback, useEffect, useState } from 'react';

export const useDecryptMessage = (
  userKey: string,
  userPriv: string,
  eventKey: string,
  eventTags: string[],
  encryptedContent: string
) => {
  const [content, setContent] = useState('');

  const extractSenderKey = useCallback(() => {
    const keyInTags = eventTags.find(([k, v]) => k === 'p' && v && v !== '')[1];
    if (keyInTags === userKey) {
      return eventKey;
    } else {
      return keyInTags;
    }
  }, [eventKey, eventTags, userKey]);

  const decrypt = useCallback(async () => {
    const senderKey = extractSenderKey();
    const result = await nip04.decrypt(userPriv, senderKey, encryptedContent);
    // update state with decrypt content
    setContent(result);
  }, [userPriv, encryptedContent, extractSenderKey]);

  useEffect(() => {
    decrypt().catch(console.error);
  }, [decrypt]);

  return content;
};
