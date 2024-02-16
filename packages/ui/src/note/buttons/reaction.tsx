import { ArrowDownIcon, ArrowUpIcon } from "@lume/icons";
import { useState } from "react";
import { useNoteContext } from "../provider";
import { useArk } from "@lume/ark";
import { cn } from "@lume/utils";

export function NoteReaction() {
  const ark = useArk();
  const event = useNoteContext();

  const [reaction, setReaction] = useState<"+" | "-">(null);

  const up = async () => {
    const res = await ark.upvote(event.id, event.pubkey);
    if (res) setReaction("+");
  };

  const down = async () => {
    const res = await ark.downvote(event.id, event.pubkey);
    if (res) setReaction("-");
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={up}
        disabled={!!reaction}
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-full",
          reaction === "+"
            ? "bg-blue-500 text-white"
            : "bg-neutral-100 text-neutral-700 hover:bg-blue-500 hover:text-white dark:bg-neutral-900 dark:text-neutral-300",
        )}
      >
        <ArrowUpIcon className="size-4" />
      </button>
      <button
        type="button"
        onClick={down}
        disabled={!!reaction}
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-full",
          reaction === "-"
            ? "bg-blue-500 text-white"
            : "bg-neutral-100 text-neutral-700 hover:bg-blue-500 hover:text-white dark:bg-neutral-900 dark:text-neutral-300",
        )}
      >
        <ArrowDownIcon className="size-4" />
      </button>
    </div>
  );
}
