import { AccountContext } from '@components/accountProvider';
import { RelayContext } from '@components/relaysProvider';
import Tooltip from '@components/tooltip';

import { WRITEONLY_RELAYS } from '@stores/constants';

import { dateToUnix } from '@utils/getDate';

import { MicMute } from 'iconoir-react';
import { getEventHash, signEvent } from 'nostr-tools';
import { useContext } from 'react';

export const MuteButton = ({ pubkey }: { pubkey: string }) => {
  const pool: any = useContext(RelayContext);
  const activeAccount: any = useContext(AccountContext);

  const muteUser = () => {
    const event: any = {
      content: '',
      created_at: dateToUnix(),
      kind: 44,
      pubkey: activeAccount.pubkey,
      tags: [['p', pubkey]],
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, activeAccount.privkey);

    // publish note
    pool.publish(event, WRITEONLY_RELAYS);
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
};
