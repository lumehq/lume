import { WRITEONLY_RELAYS } from '@stores/constants';

import { getEventHash, signEvent } from 'nostr-tools';

export const broadcast = ({ pool, data, privkey }: { pool: any; data: any; privkey: string }) => {
  const event = data;
  event.id = getEventHash(event);
  event.sig = signEvent(event, privkey);

  pool.publish(event, WRITEONLY_RELAYS);
};
