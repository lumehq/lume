import { isSSR } from '@utils/ssr';
import { getAllRelays } from '@utils/storage';

import { atomWithCache } from 'jotai-cache';

export const relaysAtom = atomWithCache(async () => {
  const response = isSSR ? null : await getAllRelays();
  return response;
});
