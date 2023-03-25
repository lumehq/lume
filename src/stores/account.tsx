import { isSSR } from '@utils/ssr';
import { getActiveAccount } from '@utils/storage';

import { atom } from 'jotai';

export const activeAccountAtom = atom(async () => {
  const response = isSSR ? {} : await getActiveAccount();
  return response;
});
