import { cn } from "@lume/utils";
import * as HoverCard from "@radix-ui/react-hover-card";
import { User } from "../user";
import { useNoteContext } from "./provider";

export function NoteUser({ className }: { className?: string }) {
  const event = useNoteContext();

  return (
    <User.Provider pubkey={event.pubkey}>
      <HoverCard.Root>
        <User.Root
          className={cn("flex items-start justify-between", className)}
        >
          <div className="flex gap-3">
            <HoverCard.Trigger>
              <User.Avatar className="size-10 shrink-0 rounded-full object-cover ring-1 ring-neutral-200/50 dark:ring-neutral-800/50" />
            </HoverCard.Trigger>
            <div>
              <User.Name className="font-semibold leading-tight text-neutral-950 dark:text-neutral-50" />
              <User.NIP05 className="leading-tight text-neutral-600 dark:text-neutral-400" />
            </div>
          </div>
          <User.Time
            time={event.created_at}
            className="text-neutral-500 dark:text-neutral-400"
          />
        </User.Root>
        <HoverCard.Portal>
          <HoverCard.Content
            className="data-[side=bottom]:animate-slideUpAndFade w-[300px] rounded-xl bg-white p-5 shadow-lg shadow-neutral-500/20 data-[state=open]:transition-all dark:border dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none"
            sideOffset={5}
          >
            <div className="flex flex-col gap-2">
              <User.Avatar className="size-11 rounded-lg object-cover ring-1 ring-neutral-200/50 dark:ring-neutral-800/50" />
              <div className="flex flex-col gap-2">
                <div>
                  <User.Name className="font-semibold leading-tight" />
                  <User.NIP05 className="text-neutral-600 dark:text-neutral-400" />
                </div>
                <User.About className="line-clamp-3" />
                <a
                  href={`/users/${event.pubkey}`}
                  className="mt-3 inline-flex h-8 w-full items-center justify-center rounded-lg bg-neutral-100 text-sm font-medium hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                >
                  View profile
                </a>
              </div>
            </div>
            <HoverCard.Arrow className="fill-white dark:fill-neutral-800" />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </User.Provider>
  );
}
