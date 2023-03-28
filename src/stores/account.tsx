import { isSSR } from '@utils/ssr';
import { getActiveAccount } from '@utils/storage';

import { atomWithCache } from 'jotai-cache';

export const activeAccountAtom = atomWithCache(async () => {
  const response = isSSR ? {} : await getActiveAccount();
  return response;
});
