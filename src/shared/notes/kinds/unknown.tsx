import { NDKEvent } from '@nostr-dev-kit/ndk';

export function UnknownNote({ event }: { event: NDKEvent }) {
  return (
    <div className="mb-3 mt-3 flex w-full flex-col gap-2">
      <div className="inline-flex flex-col gap-1 rounded-md bg-white/10 px-2 py-2">
        <span className="text-sm font-medium leading-none text-white/50">
          Unknown kind: {event.kind}
        </span>
        <p className="text-sm leading-none text-white">
          Lume isn&apos;t fully support this kind
        </p>
      </div>
      <div className="select-text whitespace-pre-line	break-all text-white">
        <p>{event.content.toString()}</p>
      </div>
    </div>
  );
}
