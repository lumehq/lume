import { ZapIcon } from "@lume/icons";

export function NoteZap() {
  return (
    <button
      type="button"
      className="group inline-flex h-7 w-7 items-center justify-center text-neutral-800 dark:text-neutral-200"
    >
      <ZapIcon className="size-5 group-hover:text-blue-500" />
    </button>
  );
}
