import { createPleb, getPleb } from '@utils/storage';

import { fetch } from '@tauri-apps/api/http';
import { useCallback, useEffect, useState } from 'react';

export const fetchProfileMetadata = async (pubkey: string) => {
  const result = await fetch(`https://rbr.bio/${pubkey}/metadata.json`, {
    method: 'GET',
    timeout: 5,
  });
  return await result.data;
};

export const useProfileMetadata = (pubkey: string) => {
  const [profile, setProfile] = useState(null);

  const getProfileFromDB = useCallback(async (pubkey: string) => {
    return await getPleb(pubkey);
  }, []);

  const insertPlebToDB = useCallback(async (pubkey: string, metadata: string) => {
    return createPleb(pubkey, metadata);
  }, []);

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      getProfileFromDB(pubkey)
        .then((res: any) => {
          if (res) {
            // update state
            setProfile(JSON.parse(res.metadata));
          } else {
            fetchProfileMetadata(pubkey).then((res: any) => {
              if (res) {
                // update state
                setProfile(JSON.parse(res.content));
                // insert to db
                insertPlebToDB(pubkey, res.content);
              }
            });
          }
        })
        .catch(console.error);
    }

    return () => {
      ignore = true;
    };
  }, [getProfileFromDB, insertPlebToDB, pubkey]);

  return profile;
};
