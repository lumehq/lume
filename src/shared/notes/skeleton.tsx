export function NoteSkeleton() {
  return (
    <div className="flex h-min flex-col">
      <div className="flex items-start gap-3">
        <div className="relative h-10 w-10 shrink-0 animate-pulse overflow-hidden rounded-lg bg-neutral-400 dark:bg-neutral-600" />
        <div className="h-6 w-full">
          <div className="h-4 w-24 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
        </div>
      </div>
      <div className="-mt-4 flex gap-3">
        <div className="w-10 shrink-0" />
        <div className="flex w-full flex-col gap-1">
          <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
        </div>
      </div>
    </div>
  );
}
