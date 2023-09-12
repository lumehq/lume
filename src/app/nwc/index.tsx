import { NWCAlby } from '@app/nwc/components/alby';
import { NWCOther } from '@app/nwc/components/other';

export function NWCScreen() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full flex-col gap-5">
        <div className="text-center">
          <h3 className="text-2xl font-bold leading-tight">Nostr Wallet Connect</h3>
          <p className="leading-tight text-white/50">
            Sending tips easily via Bitcoin Lightning.
          </p>
        </div>
        <div className="mx-auto flex w-full max-w-lg flex-col gap-3 divide-y divide-white/5 rounded-xl bg-white/10 p-3">
          <NWCAlby />
          <NWCOther />
        </div>
      </div>
    </div>
  );
}
