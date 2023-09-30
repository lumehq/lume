import { RelayList } from '@app/relays/components/relayList';
import { UserRelay } from '@app/relays/components/userRelay';

export function RelaysScreen() {
  return (
    <div className="grid h-full w-full grid-cols-3">
      <RelayList />
      <div className="col-span-1">
        <div className="inline-flex h-16 w-full items-center border-b border-white/5 px-3">
          <h3 className="font-semibold text-white">Connected relays</h3>
        </div>
        <UserRelay />
      </div>
    </div>
  );
}
