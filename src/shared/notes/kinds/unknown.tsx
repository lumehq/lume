import { NDKEvent } from '@nostr-dev-kit/ndk';

export function UnknownNote(props: { event?: NDKEvent }) {
  return (
    <div className="mt-2 flex w-full flex-col gap-2">
      <div className="inline-flex flex-col rounded-md bg-zinc-200 px-2 py-2 dark:bg-zinc-800">
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Kind: {props.event.kind}
        </span>
        <p className="text-sm text-zinc-800 dark:text-zinc-200">
          Unsupport kind on newsfeed
        </p>
      </div>
      <div className="select-text whitespace-pre-line	break-all text-zinc-800 dark:text-zinc-200">
        <p>{props.event.content.toString()}</p>
      </div>
    </div>
  );
}
