import { RelayContext } from '@components/contexts/relay';
import { Content } from '@components/note/content';

import useLocalStorage from '@rehooks/local-storage';
import { memo, useCallback, useContext, useEffect, useState } from 'react';

export const RootNote = memo(function RootNote({ id }: { id: string }) {
  const relayPool: any = useContext(RelayContext);

  const [relays]: any = useLocalStorage('relays');
  const [event, setEvent] = useState(null);

  const fetchEvent = useCallback(() => {
    relayPool.subscribe(
      [
        {
          ids: [id],
          kinds: [1],
        },
      ],
      relays,
      (event: any) => {
        setEvent(event);
      }
    );
  }, [id, relayPool, relays]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  if (event) {
    return (
      <div className="relative pb-5">
        <div className="absolute top-0 left-[21px] h-full w-px bg-zinc-800"></div>
        <Content data={event} />
      </div>
    );
  } else {
    return <>Loading...</>;
  }
});
