import { persistentAtom } from '@nanostores/persistent';

export const follows = persistentAtom('follows', [], {
  encode(value) {
    return JSON.stringify(value);
  },
  decode(value) {
    return JSON.parse(value);
  },
});
