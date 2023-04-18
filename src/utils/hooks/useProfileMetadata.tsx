import { createPleb } from '@utils/storage';

import useLocalStorage from '@rehooks/local-storage';
import { fetch } from '@tauri-apps/api/http';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const fetchProfileMetadata = async (pubkey: string) => {
  const result = await fetch(`https://rbr.bio/${pubkey}/metadata.json`, {
    method: 'GET',
    timeout: 5,
  });
  return await result.data;
};

export const useProfileMetadata = (pubkey) => {
  const [activeAccount]: any = useLocalStorage('account', {});
  const [plebs] = useLocalStorage('plebs', []);
  const [profile, setProfile] = useState(null);

  const cacheProfile = useMemo(() => {
    let metadata = false;

    if (pubkey === activeAccount.pubkey) {
      metadata = JSON.parse(activeAccount.metadata);
    } else {
      const findInStorage = plebs.find((item) => item.pubkey === pubkey);

      if (findInStorage !== undefined) {
        metadata = JSON.parse(findInStorage.metadata);
      }
    }

    return metadata;
  }, [plebs, pubkey, activeAccount.pubkey, activeAccount.metadata]);

  const insertPlebToDB = useCallback(async (pubkey: string, metadata: string) => {
    return createPleb(pubkey, metadata);
  }, []);

  useEffect(() => {
    if (!cacheProfile) {
      fetchProfileMetadata(pubkey)
        .then((res: any) => {
          // update state
          setProfile(JSON.parse(res.content));
          // save to db
          insertPlebToDB(pubkey, res.content);
        })
        .catch(console.error);
    }
  }, [cacheProfile, insertPlebToDB, pubkey]);

  if (cacheProfile) {
    return cacheProfile;
  } else {
    return profile;
  }
};
