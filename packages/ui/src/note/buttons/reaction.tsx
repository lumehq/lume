import { ArrowDownIcon, ArrowUpIcon } from "@lume/icons";
import { useState } from "react";
import { useNoteContext } from "../provider";

export function NoteReaction() {
  const event = useNoteContext();
  const [reaction, setReaction] = useState<"+" | "-">(null);

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        className="inline-flex size-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 hover:bg-blue-500 hover:text-white dark:bg-neutral-900 dark:text-neutral-300"
      >
        <ArrowUpIcon className="size-4" />
      </button>
      <button
        type="button"
        className="inline-flex size-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 hover:bg-blue-500 hover:text-white dark:bg-neutral-900 dark:text-neutral-300"
      >
        <ArrowDownIcon className="size-4" />
      </button>
    </div>
  );
}
