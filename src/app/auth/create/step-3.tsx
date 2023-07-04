import { NDKEvent, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { Body, fetch } from '@tauri-apps/api/http';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@shared/button';
import { LoaderIcon } from '@shared/icons';
import { RelayContext } from '@shared/relayProvider';

import { useOnboarding } from '@stores/onboarding';

import { useAccount } from '@utils/hooks/useAccount';

export function CreateStep3Screen() {
  const ndk = useContext(RelayContext);
  const profile = useOnboarding((state: any) => state.profile);
  const navigate = useNavigate();

  const { account } = useAccount();

  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const createNIP05 = async () => {
    try {
      setLoading(true);

      const response = await fetch('https://lume.nu/api/user-create', {
        method: 'POST',
        timeout: 30,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: Body.json({
          username: username,
          pubkey: account.pubkey,
          lightningAddress: '',
        }),
      });

      if (response.ok) {
        const data = { ...profile, nip05: `${username}@lume.nu` };

        const signer = new NDKPrivateKeySigner(account.privkey);
        ndk.signer = signer;

        const event = new NDKEvent(ndk);
        // build event
        event.content = JSON.stringify(data);
        event.kind = 0;
        event.pubkey = account.pubkey;
        event.tags = [];
        // publish event
        event.publish();

        // redirect to step 4
        navigate('/auth/create/step-4', { replace: true });
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold text-zinc-100">Create your Lume ID</h1>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-800">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoCapitalize="false"
            autoCorrect="none"
            spellCheck="false"
            placeholder="satoshi"
            className="relative w-full bg-transparent py-3 pl-3.5 text-zinc-100 !outline-none placeholder:text-zinc-500"
          />
          <span className="pr-3.5 font-semibold text-fuchsia-500">@lume.nu</span>
        </div>
        <Button
          preset="large"
          onClick={() => createNIP05()}
          disabled={username.length === 0}
        >
          {loading ? (
            <LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-zinc-100" />
          ) : (
            'Continue →'
          )}
        </Button>
      </div>
    </div>
  );
}
