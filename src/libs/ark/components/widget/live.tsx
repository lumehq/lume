import { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { useEffect, useState } from 'react';
import { useArk } from '@libs/ark/provider';
import { ChevronUpIcon } from '@shared/icons';

export function WidgetLive({
  filter,
  onClick,
}: {
  filter: NDKFilter;
  onClick: () => void;
}) {
  const ark = useArk();
  const [events, setEvents] = useState<NDKEvent[]>([]);

  useEffect(() => {
    const sub = ark.subscribe({
      filter,
      closeOnEose: false,
      cb: (event: NDKEvent) => setEvents((prev) => [...prev, event]),
    });

    return () => {
      if (sub) sub.stop();
    };
  }, []);

  if (!events.length) return null;

  return (
    <div className="absolute left-0 top-11 z-50 flex h-11 w-full items-center justify-center">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex h-9 w-max items-center justify-center gap-1 rounded-full bg-blue-500 px-2.5 text-sm font-semibold text-white hover:bg-blue-600"
      >
        <ChevronUpIcon className="h-4 w-4" />
        {events.length} {events.length === 1 ? 'event' : 'events'}
      </button>
    </div>
  );
}
