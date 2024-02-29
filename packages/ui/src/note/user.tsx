import { cn } from "@lume/utils";
import * as HoverCard from "@radix-ui/react-hover-card";
import { User } from "../user";
import { useNoteContext } from "./provider";
import { useArk } from "@lume/ark";

export function NoteUser({ className }: { className?: string }) {
  const ark = useArk();
  const event = useNoteContext();

  return (
    <User.Provider pubkey={event.pubkey}>
      <HoverCard.Root>
        <User.Root
          className={cn("flex items-start justify-between", className)}
        >
          <div className="flex w-full gap-3">
            <HoverCard.Trigger>
              <User.Avatar className="size-11 shrink-0 rounded-full object-cover ring-1 ring-neutral-200/50 dark:ring-neutral-800/50" />
            </HoverCard.Trigger>
            <div className="flex-1">
              <div className="flex w-full items-center justify-between">
                <User.Name className="font-semibold leading-tight text-neutral-950 dark:text-neutral-50" />
                <User.Time
                  time={event.created_at}
                  className="leading-tight text-neutral-600 dark:text-neutral-400"
                />
              </div>
              <User.NIP05 className="leading-tight text-neutral-600 dark:text-neutral-400" />
            </div>
          </div>
        </User.Root>
        <HoverCard.Portal>
          <HoverCard.Content
            className="data-[side=bottom]:animate-slideUpAndFade w-[300px] rounded-xl bg-black p-3 data-[state=open]:transition-all dark:bg-white dark:shadow-none"
            sideOffset={5}
          >
            <div className="flex flex-col gap-2">
              <User.Avatar className="size-11 rounded-lg object-cover" />
              <div className="flex flex-col gap-2">
                <div>
                  <User.Name className="font-semibold leading-tight text-white dark:text-neutral-900" />
                  <User.NIP05 className="leading-tight text-neutral-400 dark:text-neutral-500" />
                </div>
                <User.About className="line-clamp-3 text-sm text-white dark:text-neutral-900" />
                <button
                  onClick={() => ark.open_profile(event.pubkey)}
                  className="mt-2 inline-flex h-9 w-full items-center justify-center rounded-lg bg-white text-sm font-medium hover:bg-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  View profile
                </button>
              </div>
            </div>
            <HoverCard.Arrow className="fill-black dark:fill-white" />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </User.Provider>
  );
}
