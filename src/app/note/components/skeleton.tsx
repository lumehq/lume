export const NoteSkeleton = () => {
  return (
    <div className="flex h-min flex-col">
      <div className="flex items-center gap-2.5">
        <div className="relative h-9 w-9 shrink overflow-hidden rounded-md bg-zinc-700" />
        <div className="flex flex-col gap-0.5">
          <div className="h-3 w-20 rounded-sm bg-zinc-700" />
          <div className="h-2 w-12 rounded-sm bg-zinc-700" />
        </div>
      </div>
      <div className="mt-3 animate-pulse pl-[46px]">
        <div className="flex flex-col gap-1">
          <div className="h-4 w-full rounded-sm bg-zinc-700" />
          <div className="h-4 w-2/3 rounded-sm bg-zinc-700" />
          <div className="h-4 w-1/2 rounded-sm bg-zinc-700" />
        </div>
      </div>
    </div>
  );
};
