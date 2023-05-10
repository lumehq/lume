import { METADATA_SERVICE } from '@stores/constants';

import { createPleb, getPleb } from '@utils/storage';

import useSWR from 'swr';

const fetcher = async (pubkey: string) => {
  const result = await getPleb(pubkey);
  if (result) {
    const metadata = JSON.parse(result['metadata']);
    result['content'] = metadata.content;
    delete result['metadata'];

    return result;
  } else {
    const result = await fetch(`${METADATA_SERVICE}/${pubkey}/metadata.json`);
    const resultJSON = await result.json();
    const cache = await createPleb(pubkey, resultJSON);

    if (cache) {
      return resultJSON;
    }
  }
};

export function useProfile(pubkey: string) {
  const { data, error, isLoading } = useSWR(pubkey, fetcher);

  return {
    user: data ? JSON.parse(data.content ? data.content : null) : null,
    isLoading,
    isError: error,
  };
}
