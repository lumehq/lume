import { NDKKind } from '@nostr-dev-kit/ndk';
import { useState } from 'react';
import { toast } from 'sonner';
import { useArk } from '@libs/ark';
import { LoaderIcon, RunIcon } from '@shared/icons';
import { User } from '@shared/user';

export function DepotContactCard() {
  const ark = useArk();
  const [status, setStatus] = useState(false);

  const backupContact = async () => {
    try {
      setStatus(true);

      const event = await ark.getEventByFilter({
        filter: { authors: [ark.account.pubkey], kinds: [NDKKind.Contacts] },
      });

      // broadcast to depot
      const publish = await event.publish();

      if (publish) {
        setStatus(false);
        toast.success('Backup contact list successfully.');
      }
    } catch (e) {
      setStatus(false);
      toast.error(e);
    }
  };

  return (
    <div className="flex h-56 w-full flex-col gap-2 overflow-hidden rounded-xl bg-neutral-100 p-2 dark:bg-neutral-900">
      <div className="flex flex-1 items-center justify-center rounded-lg bg-neutral-200 dark:bg-neutral-800">
        <div className="isolate flex -space-x-2">
          {ark.account.contacts
            ?.slice(0, 8)
            .map((item) => <User key={item} pubkey={item} variant="ministacked" />)}
          {ark.account.contacts?.length > 8 ? (
            <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-300 text-neutral-900 ring-1 ring-white dark:bg-neutral-700 dark:text-neutral-100 dark:ring-black">
              <span className="text-[8px] font-medium">
                +{ark.account.contacts?.length - 8}
              </span>
            </div>
          ) : null}
        </div>
      </div>
      <div className="inline-flex shrink-0 items-center justify-between">
        <div className="text-sm font-medium">Contacts</div>
        <button
          type="button"
          onClick={backupContact}
          className="inline-flex h-8 w-max items-center justify-center gap-2 rounded-md bg-blue-500 pl-2 pr-3 font-medium text-white shadow shadow-blue-500/50 hover:bg-blue-600"
        >
          {status ? (
            <LoaderIcon className="size-4 animate-spin" />
          ) : (
            <RunIcon className="size-4" />
          )}
          Backup
        </button>
      </div>
    </div>
  );
}
