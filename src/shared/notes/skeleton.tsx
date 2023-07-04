export function NoteSkeleton() {
  return (
    <div className="flex h-min flex-col pb-3">
      <div className="flex items-start gap-3">
        <div className="relative h-11 w-11 shrink overflow-hidden rounded-md bg-zinc-700" />
        <div className="flex flex-col gap-0.5">
          <div className="h-4 w-20 rounded bg-zinc-700" />
        </div>
      </div>
      <div className="-mt-5 animate-pulse pl-[49px]">
        <div className="flex flex-col gap-1">
          <div className="h-4 w-full rounded-sm bg-zinc-700" />
          <div className="h-3 w-2/3 rounded-sm bg-zinc-700" />
          <div className="h-3 w-1/2 rounded-sm bg-zinc-700" />
        </div>
      </div>
    </div>
  );
}
