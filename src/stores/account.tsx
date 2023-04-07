import { atomWithStorage, createJSONStorage } from 'jotai/utils';

const createMyJsonStorage = () => {
  const storage = createJSONStorage(() => localStorage);
  const getItem = (key) => {
    const value = storage.getItem(key);
    return value;
  };
  return { ...storage, getItem };
};

export const activeAccountAtom = atomWithStorage('activeAccount', {}, createMyJsonStorage());
export const activeAccountFollowsAtom = atomWithStorage('activeAccountFollows', [], createMyJsonStorage());
export const lastLoginAtom = atomWithStorage('lastLogin', [], createMyJsonStorage());
