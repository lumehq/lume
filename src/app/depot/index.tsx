import { NDKKind } from '@nostr-dev-kit/ndk';
import { useSignal } from '@preact/signals-react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { appConfigDir } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/primitives';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { DepotContactCard } from '@app/depot/components/contact';
import { DepotMembers } from '@app/depot/components/members';
import { DepotProfileCard } from '@app/depot/components/profile';
import { DepotRelaysCard } from '@app/depot/components/relays';
import { useArk } from '@libs/ark';
import { ChevronDownIcon, DepotIcon, GossipIcon } from '@shared/icons';

export function DepotScreen() {
  const ark = useArk();
  const dataPath = useSignal('');
  const tunnelUrl = useSignal('');

  const openFolder = async () => {
    await invoke('show_in_folder', {
      path: dataPath.value + '/nostr.db',
    });
  };

  const updateRelayList = async () => {
    try {
      if (tunnelUrl.value.length < 1) return toast.info('Please enter a valid relay url');
      if (!tunnelUrl.value.startsWith('ws'))
        return toast.info('Please enter a valid relay url');

      const relayUrl = new URL(tunnelUrl.value.replace(/\s/g, ''));
      if (!/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(relayUrl.host)) return;

      const relayEvent = await ark.getEventByFilter({
        filter: { authors: [ark.account.pubkey], kinds: [NDKKind.RelayList] },
      });

      let publish: { id: string; seens: string[] };

      if (!relayEvent) {
        publish = await ark.createEvent({
          kind: NDKKind.RelayList,
          tags: [['r', tunnelUrl.value, '']],
        });
      }

      const newTags = relayEvent.tags ?? [];
      newTags.push(['r', tunnelUrl.value, '']);

      publish = await ark.createEvent({
        kind: NDKKind.RelayList,
        tags: newTags,
      });

      if (publish) {
        await ark.createSetting('tunnel_url', tunnelUrl.value);
        toast.success('Update relay list successfully.');

        tunnelUrl.value = '';
      }
    } catch (e) {
      console.error(e);
      toast.error('Error');
    }
  };

  useEffect(() => {
    async function loadConfig() {
      const appDir = await appConfigDir();
      dataPath.value = appDir;
    }

    loadConfig();
  }, []);

  return (
    <div className="flex h-full w-full rounded-xl shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:shadow-[inset_0_0_0.5px_1px_hsla(0,0%,100%,0.075),0_0_0_1px_hsla(0,0%,0%,0.05),0_0.3px_0.4px_hsla(0,0%,0%,0.02),0_0.9px_1.5px_hsla(0,0%,0%,0.045),0_3.5px_6px_hsla(0,0%,0%,0.09)]">
      <div className="h-full w-72 shrink-0 rounded-l-xl bg-white/50 px-8 pt-8 backdrop-blur-xl dark:bg-black/50">
        <div className="flex flex-col justify-center gap-4">
          <div className="size-16 rounded-xl bg-gradient-to-bl from-teal-300 to-teal-600 p-1">
            <div className="relative inline-flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-bl from-teal-400 to-teal-700 shadow-sm shadow-white/20">
              <DepotIcon className="size-8 text-white" />
            </div>
          </div>
          <h1 className="text-xl font-semibold">Depot is running</h1>
        </div>
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="text-sm font-medium">Relay URL</div>
            <div className="inline-flex h-10 w-full select-text items-center rounded-lg bg-black/10 px-3 text-sm backdrop-blur-xl dark:bg-white/10">
              ws://localhost:6090
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="text-sm font-medium">Database</div>
            <div className="inline-flex h-10 w-full items-center gap-2 truncate rounded-lg bg-black/10 p-1 backdrop-blur-xl dark:bg-white/10">
              <p className="shrink-0 pl-2 text-sm">nostr.db (SQLite)</p>
              <button
                type="button"
                onClick={openFolder}
                className="inline-flex h-full w-full items-center justify-center rounded-md bg-white text-sm font-medium shadow hover:bg-blue-500 hover:text-white dark:bg-black"
              >
                Open
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto rounded-r-xl bg-white pb-20 dark:bg-black">
        <div className="mb-5 flex h-12 items-center border-b border-neutral-100 px-5 dark:border-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Actions
          </h3>
        </div>
        <div className="flex flex-col gap-5 px-5">
          <Collapsible.Root
            defaultOpen
            className="flex flex-col overflow-hidden rounded-xl border border-transparent bg-neutral-50 data-[state=open]:border-blue-500 dark:bg-neutral-950"
          >
            <Collapsible.Trigger className="flex h-20 items-center justify-between px-5 hover:bg-neutral-100 dark:hover:bg-neutral-900">
              <div className="flex flex-col items-start">
                <h3 className="text-lg font-semibold">Expose</h3>
                <p className="text-neutral-700 dark:text-neutral-300">
                  Make your Depot visible in the Internet, everyone can connect into it.
                </p>
              </div>
              <ChevronDownIcon className="size-5 shrink-0" />
            </Collapsible.Trigger>
            <Collapsible.Content>
              <div className="flex w-full flex-col gap-4 p-5">
                <div>
                  <p className="mb-1 font-medium">ngrok</p>
                  <input
                    readOnly
                    value="ngrok http --domain=<your_domain> 6090"
                    className="h-11 w-full rounded-lg border-transparent bg-neutral-100 px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-900 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
                  />
                </div>
                <div>
                  <p className="mb-1 font-medium">Cloudflare Tunnel</p>
                  <input
                    readOnly
                    value="cloudflared tunnel --url localhost:6090"
                    className="h-11 w-full rounded-lg border-transparent bg-neutral-100 px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-900 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
                  />
                </div>
                <div>
                  <p className="mb-1 font-medium">Local Tunnel</p>
                  <input
                    readOnly
                    value="lt --port 6090"
                    className="h-11 w-full rounded-lg border-transparent bg-neutral-100 px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-900 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
                  />
                </div>
                <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-900">
                  <div className="inline-flex items-center gap-2">
                    <GossipIcon className="size-5 text-blue-500" />
                    <h3 className="mb-1 font-semibold">
                      Support Gossip Model (Recommended)
                    </h3>
                  </div>

                  <div className="w-full max-w-xl">
                    <p className=" text-balance">
                      By adding to Relay List, other Nostr Client which support Gossip
                      Model will automatically connect to your Depot and improve the
                      discoverability.
                    </p>
                    <div className="mt-2 inline-flex w-full items-center gap-2">
                      <input
                        type="text"
                        value={tunnelUrl.value}
                        onChange={(e) => (tunnelUrl.value = e.target.value)}
                        spellCheck={false}
                        placeholder="wss://"
                        className="h-10 flex-1 rounded-lg border-transparent bg-neutral-100 px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-900 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
                      />
                      <button
                        type="button"
                        onClick={updateRelayList}
                        className="inline-flex h-10 w-max shrink-0 items-center justify-center rounded-lg bg-blue-500 px-4 font-medium text-white hover:bg-blue-600"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root className="flex flex-col overflow-hidden rounded-xl border border-transparent bg-neutral-50 data-[state=open]:border-blue-500 dark:bg-neutral-950">
            <Collapsible.Trigger className="flex h-20 items-center justify-between px-5 hover:bg-neutral-100 dark:hover:bg-neutral-900">
              <div className="flex flex-col items-start">
                <h3 className="text-lg font-semibold">Backup (Recommended)</h3>
                <p className="text-neutral-700 dark:text-neutral-300">
                  Backup all your data to Depot, it always live on your machine.
                </p>
              </div>
              <ChevronDownIcon className="size-5 shrink-0" />
            </Collapsible.Trigger>
            <Collapsible.Content>
              <div className="grid grid-cols-3 gap-4 px-5 py-5">
                <DepotProfileCard />
                <DepotContactCard />
                <DepotRelaysCard />
              </div>
            </Collapsible.Content>
          </Collapsible.Root>
          <DepotMembers />
        </div>
      </div>
    </div>
  );
}
