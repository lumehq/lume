import { ArrowDownIcon, ArrowUpIcon, LoaderIcon } from "@lume/icons";
import { useState } from "react";
import { useNoteContext } from "../provider";
import { useArk } from "@lume/ark";
import { cn } from "@lume/utils";

export function NoteDownvote() {
  const ark = useArk();
  const event = useNoteContext();

  const [reaction, setReaction] = useState<"-" | null>(null);
  const [loading, setLoading] = useState(false);

  const down = async () => {
    // start loading
    setLoading(true);

    const res = await ark.downvote(event.id, event.pubkey);
    if (res) setReaction("-");

    // stop loading
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={down}
      disabled={!!reaction || loading}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-full",
        reaction === "-"
          ? "bg-blue-500 text-white"
          : "bg-neutral-100 text-neutral-700 hover:bg-blue-500 hover:text-white dark:bg-neutral-900 dark:text-neutral-300",
      )}
    >
      {loading ? (
        <LoaderIcon className="size-4 animate-spin" />
      ) : (
        <ArrowDownIcon className="size-4" />
      )}
    </button>
  );
}