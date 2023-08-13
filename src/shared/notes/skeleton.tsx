export function NoteSkeleton() {
  return (
    <div className="flex h-min flex-col">
      <div className="flex items-start gap-3">
        <div className="relative h-11 w-11 shrink overflow-hidden rounded-lg bg-white/10" />
        <div className="h-3 w-20 rounded bg-white/10" />
      </div>
      <div className="-mt-6 animate-pulse pl-[49px]">
        <div className="flex flex-col gap-1">
          <div className="h-3 w-full rounded bg-white/10" />
          <div className="h-3 w-2/3 rounded bg-white/10" />
          <div className="h-3 w-1/2 rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}
