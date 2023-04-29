import { RelayContext } from '@lume/shared/relayProvider';
import Tooltip from '@lume/shared/tooltip';
import { WRITEONLY_RELAYS } from '@lume/stores/constants';
import { dateToUnix } from '@lume/utils/getDate';
import { useActiveAccount } from '@lume/utils/hooks/useActiveAccount';

import { EyeClose } from 'iconoir-react';
import { getEventHash, signEvent } from 'nostr-tools';
import { useContext } from 'react';

export default function MessageHideButton({ id }: { id: string }) {
  const pool: any = useContext(RelayContext);
  const { account, isError, isLoading } = useActiveAccount();

  const hideMessage = () => {
    if (!isError && !isLoading && account) {
      const event: any = {
        content: '',
        created_at: dateToUnix(),
        kind: 43,
        pubkey: account.pubkey,
        tags: [['e', id]],
      };
      event.id = getEventHash(event);
      event.sig = signEvent(event, account.privkey);

      // publish note
      pool.publish(event, WRITEONLY_RELAYS);
    } else {
      console.log('error');
    }
  };

  return (
    <Tooltip message="Hide this message">
      <button
        onClick={() => hideMessage()}
        className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-zinc-800"
      >
        <EyeClose width={16} height={16} className="text-zinc-400" />
      </button>
    </Tooltip>
  );
}
