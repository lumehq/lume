import Tooltip from '@lume/shared/tooltip';
import { WRITEONLY_RELAYS } from '@lume/stores/constants';
import { dateToUnix } from '@lume/utils/getDate';
import { useActiveAccount } from '@lume/utils/hooks/useActiveAccount';

import { MicMute } from 'iconoir-react';
import { RelayPool } from 'nostr-relaypool';
import { getEventHash, signEvent } from 'nostr-tools';

export default function MessageMuteButton({ pubkey }: { pubkey: string }) {
  const { account, isError, isLoading } = useActiveAccount();

  const muteUser = () => {
    if (!isError && !isLoading && account) {
      const pool = new RelayPool(WRITEONLY_RELAYS);
      const event: any = {
        content: '',
        created_at: dateToUnix(),
        kind: 44,
        pubkey: account.pubkey,
        tags: [['p', pubkey]],
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
    <Tooltip message="Mute this user">
      <button
        onClick={() => muteUser()}
        className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-zinc-800"
      >
        <MicMute width={16} height={16} className="text-zinc-400" />
      </button>
    </Tooltip>
  );
}
