import { persistentAtom } from '@nanostores/persistent';

export const currentUser = persistentAtom(
  'currentUser',
  {},
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);
