export function DepotScreen() {
  return (
    <div className="px-16 py-14">
      <div className="mx-auto w-full max-w-md">
        <div className="flex flex-col gap-10">
          <div className="text-center">
            <h1 className="mb-1 text-2xl font-semibold text-neutral-400 dark:text-neutral-600">
              Your Depot is running
            </h1>
            <div className="flex items-center justify-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-teal-500"></span>
              </span>
              <p className="font-medium">ws://localhost:6090</p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold">Backup</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Sync all your data to Depot.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-9 w-20 shrink-0 items-center justify-center rounded-lg bg-neutral-200 font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
              >
                Sync
              </button>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold">Expose</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Help other users can see your depot on Internet. You also can do it by
                  yourself by using other service like ngrok or localtunnel.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-9 w-20 shrink-0 items-center justify-center rounded-lg bg-neutral-200 font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
              >
                Start
              </button>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold">Relay Hint</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Instruct other Nostr client find your events in this depot.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-9 w-20 shrink-0 items-center justify-center rounded-lg bg-neutral-200 font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
              >
                Add
              </button>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold">Invite</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  By default, only you can write event to Depot, but you can invite other
                  user to your Depot.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-9 w-20 shrink-0 items-center justify-center rounded-lg bg-neutral-200 font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
              >
                Invite
              </button>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold">Customize</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Depot also provide plenty config to customize your experiences.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-9 w-20 shrink-0 items-center justify-center rounded-lg bg-neutral-200 font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
              >
                Config
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
