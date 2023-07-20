export function NoteSkeleton() {
  return (
    <div className="flex h-min flex-col pb-3">
      <div className="flex items-start gap-3">
        <div className="relative h-11 w-11 shrink overflow-hidden rounded-lg bg-zinc-700" />
        <div className="flex flex-col gap-0.5">
          <div className="h-3 w-20 rounded bg-zinc-700" />
        </div>
      </div>
      <div className="-mt-5 animate-pulse pl-[49px]">
        <div className="flex flex-col gap-1">
          <div className="h-3 w-full rounded bg-zinc-700" />
          <div className="h-3 w-2/3 rounded bg-zinc-700" />
          <div className="h-3 w-1/2 rounded bg-zinc-700" />
        </div>
      </div>
    </div>
  );
}
