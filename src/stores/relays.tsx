import { isSSR } from '@utils/ssr';
import { getAllRelays } from '@utils/storage';

import { atom } from 'jotai';

export const relaysAtom = atom(async () => {
  const response = isSSR ? [] : await getAllRelays();
  return response;
});
