import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';

import { NoteSkeleton, Reply } from '@shared/notes';

import { NDKEventWithReplies } from '@utils/types';

export function RepliesList({ id }: { id: string }) {
  const { ndk } = useNDK();
  const { status, data } = useQuery(['note-replies', id], async () => {
    const events = await ndk.fetchEvents({
      kinds: [1],
      '#e': [id],
    });

    const array = [...events] as unknown as NDKEventWithReplies[];

    if (array.length > 0) {
      const replies = new Set();
      array.forEach((event) => {
        const tags = event.tags.filter((el) => el[0] === 'e' && el[1] !== id);
        if (tags.length > 0) {
          tags.forEach((tag) => {
            const rootIndex = array.findIndex((el) => el.id === tag[1]);
            if (rootIndex) {
              const rootEvent = array[rootIndex];
              if (rootEvent.replies) {
                rootEvent.replies.push(event);
              } else {
                rootEvent.replies = [event];
              }
              replies.add(event.id);
            }
          });
        }
      });
      const cleanEvents = array.filter((ev) => !replies.has(ev.id));
      return cleanEvents;
    }
    return array;
  });

  if (status === 'loading') {
    return (
      <div className="mt-3">
        <div className="flex flex-col">
          <div className="rounded-xl bg-white/10 px-3 py-3">
            <NoteSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 pb-10">
      <div className="mb-2">
        <h5 className="text-lg font-semibold text-white">{data?.length || 0} replies</h5>
      </div>
      <div className="flex flex-col">
        {data?.length === 0 ? (
          <div className="px=3">
            <div className="flex w-full items-center justify-center rounded-xl bg-white/10">
              <div className="flex flex-col items-center justify-center gap-2 py-6">
                <h3 className="text-3xl">👋</h3>
                <p className="leading-none text-white/50">Share your thought on it...</p>
              </div>
            </div>
          </div>
        ) : (
          data
            .reverse()
            .map((event: NDKEventWithReplies) => (
              <Reply key={event.id} event={event} root={id} />
            ))
        )}
      </div>
    </div>
  );
}
