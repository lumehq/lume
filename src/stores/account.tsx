import { isSSR } from '@utils/ssr';
import { getActiveAccount } from '@utils/storage';

import { atomWithCache } from 'jotai-cache';

export const activeAccountAtom = atomWithCache(async () => {
  const response = isSSR ? null : await getActiveAccount();
  return response;
});
