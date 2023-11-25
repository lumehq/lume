import { useStorage } from '@libs/storage/provider';

import { CheckCircleIcon } from '@shared/icons';

import { useOnboarding } from '@stores/onboarding';

export function OutboxModel() {
  const { db } = useStorage();

  const [outbox, setOutbox] = useOnboarding((state) => [
    state.outbox,
    state.toggleOutbox,
  ]);

  const enableOutbox = async () => {
    await db.createSetting('outbox', '1');
    setOutbox();
  };

  return (
    <div className="rounded-xl bg-neutral-100 p-3 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h5 className="font-semibold">Enable Outbox</h5>
          <p className="text-sm">
            When you request information about a user, Lume will automatically query the
            user&apos;s outbox relays and subsequent queries will favour using those
            relays for queries with that user&apos;s pubkey.
          </p>
        </div>
        {outbox ? (
          <div className="mt-1 inline-flex h-9 w-24 shrink-0 items-center justify-center rounded-lg bg-teal-500 text-white">
            <CheckCircleIcon className="h-4 w-4" />
          </div>
        ) : (
          <button
            type="button"
            onClick={enableOutbox}
            className="mt-1 inline-flex h-9 w-24 shrink-0 items-center justify-center rounded-lg bg-neutral-200 font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
          >
            Enable
          </button>
        )}
      </div>
    </div>
  );
}
