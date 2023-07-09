import { appConfigDir } from '@tauri-apps/api/path';
import { Stronghold } from 'tauri-plugin-stronghold-api';

import { useStronghold } from '@stores/stronghold';

const dir = await appConfigDir();

export function useSecureStorage() {
  const password = useStronghold((state) => state.password);

  async function getClient(stronghold: Stronghold) {
    try {
      return await stronghold.loadClient('lume');
    } catch {
      return await stronghold.createClient('lume');
    }
  }

  const save = async (key: string, value: string, userpass?: string) => {
    const stronghold = await Stronghold.load(
      `${dir}lume.stronghold`,
      userpass ? userpass : password
    );
    const client = await getClient(stronghold);
    const store = client.getStore();
    await store.insert(key, Array.from(new TextEncoder().encode(value)));
    return await stronghold.save();
  };

  const load = async (key: string, userpass?: string) => {
    const stronghold = await Stronghold.load(
      `${dir}lume.stronghold`,
      userpass ? userpass : password
    );
    const client = await getClient(stronghold);
    const store = client.getStore();
    const value = await store.get(key);
    const decoded = new TextDecoder().decode(new Uint8Array(value));
    return decoded;
  };

  return { save, load };
}
