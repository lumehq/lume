import { memo } from 'react';

export const Placeholder = memo(function Placeholder() {
  return (
    <div className="relative z-10 flex h-min animate-pulse select-text flex-col py-5 px-3">
      <div className="flex items-start gap-2">
        <div className="relative h-11 w-11 shrink overflow-hidden rounded-full bg-zinc-700" />
        <div className="flex w-full flex-1 items-start justify-between">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-4 w-16 rounded bg-zinc-700" />
              <span className="text-zinc-500">·</span>
              <div className="h-4 w-12 rounded bg-zinc-700" />
            </div>
            <div className="h-3 w-3 rounded-full bg-zinc-700" />
          </div>
        </div>
      </div>
      <div className="-mt-5 pl-[52px]">
        <div className="flex flex-col gap-6">
          <div className="h-16 w-full rounded bg-zinc-700" />
          <div className="flex items-center gap-8">
            <div className="h-4 w-12 rounded bg-zinc-700" />
            <div className="h-4 w-12 rounded bg-zinc-700" />
          </div>
        </div>
      </div>
    </div>
  );
});
