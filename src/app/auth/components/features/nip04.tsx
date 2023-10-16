export function NIP04() {
  return (
    <div className="rounded-xl bg-neutral-100 p-3 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
      <div className="flex items-start justify-between">
        <div>
          <h5 className="font-semibold">Enable direct message (Deprecated)</h5>
          <p className="text-sm">
            Send direct message to other user (NIP-04), all messages will be encrypted,
            but your metadata will be leaked.
          </p>
        </div>
        <button
          type="button"
          className="mt-1 h-9 w-24 shrink-0 rounded-lg bg-neutral-200 font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
        >
          Enable
        </button>
      </div>
    </div>
  );
}
