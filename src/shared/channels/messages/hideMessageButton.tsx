import { AccountContext } from '@lume/shared/accountProvider';
import { RelayContext } from '@lume/shared/relaysProvider';
import Tooltip from '@lume/shared/tooltip';
import { WRITEONLY_RELAYS } from '@lume/stores/constants';
import { dateToUnix } from '@lume/utils/getDate';

import { EyeClose } from 'iconoir-react';
import { getEventHash, signEvent } from 'nostr-tools';
import { useCallback, useContext } from 'react';

export const HideMessageButton = ({ id }: { id: string }) => {
  const pool: any = useContext(RelayContext);
  const activeAccount: any = useContext(AccountContext);

  const hideMessage = useCallback(() => {
    const event: any = {
      content: '',
      created_at: dateToUnix(),
      kind: 43,
      pubkey: activeAccount.pubkey,
      tags: [['e', id]],
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, activeAccount.privkey);

    // publish note
    pool.publish(event, WRITEONLY_RELAYS);
  }, [activeAccount.pubkey, activeAccount.privkey, id, pool]);

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
};
