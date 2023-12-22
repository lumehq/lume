import * as Dialog from '@radix-ui/react-dialog';
import { resolveResource } from '@tauri-apps/api/path';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { nip19 } from 'nostr-tools';
import { useEffect, useState } from 'react';
import { parse, stringify } from 'smol-toml';
import { toast } from 'sonner';
import { CancelIcon, PlusIcon, UserAddIcon, UserRemoveIcon } from '@shared/icons';
import { User } from '@shared/user';

export function DepotMembers() {
  const [members, setMembers] = useState<Set<string>>(null);
  const [tmpMembers, setTmpMembers] = useState<Array<string>>([]);
  const [newMember, setNewMember] = useState('');

  const addMember = async () => {
    if (!newMember.startsWith('npub1'))
      return toast.error('You need to enter a valid npub');

    try {
      const pubkey = nip19.decode(newMember).data as string;
      setTmpMembers((prev) => [...prev, pubkey]);
    } catch (e) {
      console.error(e);
    }
  };

  const removeMember = (member: string) => {
    setTmpMembers((prev) => prev.filter((item) => item !== member));
  };

  const updateMembers = async () => {
    setMembers(new Set(tmpMembers));

    const defaultConfig = await resolveResource('resources/config.toml');
    const config = await readTextFile(defaultConfig);
    const configContent = parse(config);

    configContent.authorization['pubkey_whitelist'] = [...members];

    const newConfig = stringify(configContent);

    return await writeTextFile(defaultConfig, newConfig);
  };

  useEffect(() => {
    async function loadConfig() {
      const defaultConfig = await resolveResource('resources/config.toml');
      const config = await readTextFile(defaultConfig);
      const configContent = parse(config);
      setTmpMembers(Array.from(configContent.authorization['pubkey_whitelist']));
    }

    loadConfig();
  }, []);

  return (
    <Dialog.Root>
      <div className="flex items-center justify-between rounded-lg bg-neutral-50 p-5 dark:bg-neutral-950">
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Members</h3>
          <p className="text-neutral-700 dark:text-neutral-300">
            Only allowed users can publish event to your Depot
          </p>
        </div>
        <div className="inline-flex items-center gap-2">
          <div className="isolate flex -space-x-2">
            {tmpMembers.slice(0, 5).map((item) => (
              <User key={item} pubkey={item} variant="stacked" />
            ))}
            {tmpMembers.length > 5 ? (
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-neutral-900 ring-1 ring-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-neutral-700">
                <span className="text-xs font-medium">+{tmpMembers.length}</span>
              </div>
            ) : null}
          </div>
          <Dialog.Trigger className="inline-flex h-8 w-max items-center justify-center gap-1 rounded-lg bg-blue-500 px-3 text-white hover:bg-blue-600">
            <UserAddIcon className="size-4" />
            Manage
          </Dialog.Trigger>
        </div>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm dark:bg-black/20" />
        <Dialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-xl overflow-hidden rounded-xl bg-white dark:bg-black">
            <div className="inline-flex h-14 w-full shrink-0 items-center justify-between border-b border-neutral-100 px-5 dark:border-neutral-900">
              <Dialog.Title className="text-center font-semibold">
                Manage member
              </Dialog.Title>
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={updateMembers}
                  className="inline-flex h-8 w-max items-center justify-center rounded-lg bg-blue-500 px-2.5 text-sm font-medium text-white hover:bg-blue-600"
                >
                  Update
                </button>
                <Dialog.Close className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                  <CancelIcon className="size-4" />
                </Dialog.Close>
              </div>
            </div>
            <div className="pb-3">
              <div className="relative mb-2 mt-4 w-full px-5">
                <input
                  type="text"
                  spellCheck={false}
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  placeholder="npub1..."
                  className="h-11 w-full rounded-lg border-transparent bg-neutral-100 pl-3 pr-20 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-900 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
                />
                <button
                  type="button"
                  onClick={addMember}
                  className="absolute right-7 top-1/2 inline-flex h-7 w-max -translate-y-1/2 transform items-center justify-center gap-1 rounded-md bg-neutral-200 px-2.5 text-sm font-medium text-blue-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-800"
                >
                  <PlusIcon className="size-4" />
                  Add
                </button>
              </div>
              {tmpMembers.map((member) => (
                <div
                  key={member}
                  className="group flex items-center justify-between px-5 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  <User pubkey={member} variant="simple" />
                  <button
                    type="button"
                    onClick={() => removeMember(member)}
                    className="hidden size-6 items-center justify-center rounded-md bg-neutral-200 group-hover:inline-flex hover:bg-red-200 dark:bg-neutral-800 dark:hover:bg-red-800 dark:hover:text-red-200"
                  >
                    <UserRemoveIcon className="size-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
