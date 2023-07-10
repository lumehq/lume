import { useState } from 'react';

import { EyeOffIcon, EyeOnIcon } from '@shared/icons';

import { useStronghold } from '@stores/stronghold';

import { useAccount } from '@utils/hooks/useAccount';

export function AccountSettingsScreen() {
  const { status, account } = useAccount();
  const [type, setType] = useState('password');

  const privkey = useStronghold((state) => state.privkey);

  const showPrivateKey = () => {
    if (type === 'password') {
      setType('text');
    } else {
      setType('password');
    }
  };

  return (
    <div className="h-full w-full px-3 pt-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-semibold text-zinc-100">Account</h1>
        <div className="">
          {status === 'loading' ? (
            <p>Loading...</p>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="pubkey" className="text-base font-semibold text-zinc-400">
                  Public Key
                </label>
                <input
                  readOnly
                  value={account.pubkey}
                  className="relative w-2/3 rounded-lg bg-zinc-800 py-3 pl-3.5 pr-11 text-zinc-100 !outline-none placeholder:text-zinc-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="npub" className="text-base font-semibold text-zinc-400">
                  Npub
                </label>
                <input
                  readOnly
                  value={account.npub}
                  className="relative w-2/3 rounded-lg bg-zinc-800 py-3 pl-3.5 pr-11 text-zinc-100 !outline-none placeholder:text-zinc-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="privkey"
                  className="text-base font-semibold text-zinc-400"
                >
                  Private Key
                </label>
                <div className="relative w-2/3">
                  <input
                    readOnly
                    type={type}
                    value={privkey}
                    className="relative w-full rounded-lg bg-zinc-800 py-3 pl-3.5 pr-11 text-zinc-100 !outline-none placeholder:text-zinc-400"
                  />
                  <button
                    type="button"
                    onClick={() => showPrivateKey()}
                    className="group absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 hover:bg-zinc-700"
                  >
                    {type === 'password' ? (
                      <EyeOffIcon
                        width={20}
                        height={20}
                        className="text-zinc-500 group-hover:text-zinc-100"
                      />
                    ) : (
                      <EyeOnIcon
                        width={20}
                        height={20}
                        className="text-zinc-500 group-hover:text-zinc-100"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
