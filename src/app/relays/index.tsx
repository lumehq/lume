import { RelayList } from '@app/relays/components/relayList';
import { UserRelayList } from '@app/relays/components/userRelayList';

export function RelaysScreen() {
  return (
    <div className="grid h-full w-full grid-cols-3">
      <RelayList />
      <UserRelayList />
    </div>
  );
}
