export function NoteSkeleton() {
  return (
    <div className="flex h-min flex-col">
      <div className="flex items-start gap-3">
        <div className="relative h-11 w-11 shrink overflow-hidden rounded-lg bg-neutral-400 dark:bg-neutral-600" />
        <div className="h-3 w-20 rounded bg-neutral-400 dark:bg-neutral-600" />
      </div>
      <div className="-mt-5 flex animate-pulse gap-3">
        <div className="w-10 shrink-0" />
        <div className="flex flex-col gap-1">
          <div className="h-3 w-full rounded bg-neutral-400 dark:bg-neutral-600" />
          <div className="h-3 w-2/3 rounded bg-neutral-400 dark:bg-neutral-600" />
          <div className="h-3 w-1/2 rounded bg-neutral-400 dark:bg-neutral-600" />
        </div>
      </div>
    </div>
  );
}
