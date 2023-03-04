import { RelayContext } from '@components/contexts/relay';
import { Content } from '@components/note/content';
import NoteReply from '@components/note/modal/noteReply';

import useLocalStorage from '@rehooks/local-storage';
import { memo, useContext, useState } from 'react';

const Modal = ({ event }: { event: any }) => {
  const relayPool: any = useContext(RelayContext);
  const [relays]: any = useLocalStorage('relays');
  const [events, setEvents] = useState([]);

  relayPool.subscribe(
    [
      {
        '#e': [event.id],
        since: event.created_at,
        kinds: [1],
      },
    ],
    relays,
    (event: any) => {
      setEvents((events) => [event, ...events]);
    },
    undefined,
    (events: any, relayURL: any) => {
      console.log(events, relayURL);
    }
  );

  return (
    <div className="flex min-h-full items-center justify-center p-4">
      <div className="relative h-[90vh] w-full max-w-3xl transform overflow-hidden rounded-lg text-zinc-100 shadow-modal transition-all">
        <div className="absolute top-0 left-0 h-full w-full bg-black bg-opacity-20 backdrop-blur-lg"></div>
        <div className="relative z-10 h-full p-4">
          <div className="relative h-full overflow-auto rounded-lg border-[0.5px] border-white/30 bg-zinc-800 p-4 shadow-inner">
            <div className="flex flex-col gap-4">
              <Content data={event} />
            </div>
            <div className="flex flex-col gap-2 divide-y divide-zinc-700">
              {events.map((item) => (
                <NoteReply key={item.id} event={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Modal);
