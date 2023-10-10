import { NDKEvent } from '@nostr-dev-kit/ndk';

export function UnknownNote(props: { event?: NDKEvent }) {
  return (
    <div className="mt-2 flex w-full flex-col gap-2">
      <div className="inline-flex flex-col rounded-md bg-neutral-200 px-2 py-2 dark:bg-neutral-800">
        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          Kind: {props.event.kind}
        </span>
        <p className="text-sm text-neutral-800 dark:text-neutral-200">
          Unsupport kind on newsfeed
        </p>
      </div>
      <div className="select-text whitespace-pre-line	break-all text-neutral-800 dark:text-neutral-200">
        <p>{props.event.content.toString()}</p>
      </div>
    </div>
  );
}
