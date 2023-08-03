import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs';
import { generatePrivateKey, getPublicKey, nip19 } from 'nostr-tools';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createAccount } from '@libs/storage';

import { Button } from '@shared/button';
import { EyeOffIcon, EyeOnIcon, LoaderIcon } from '@shared/icons';

import { useOnboarding } from '@stores/onboarding';
import { useStronghold } from '@stores/stronghold';

export function CreateStep1Screen() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setPrivkey = useStronghold((state) => state.setPrivkey);
  const setPubkey = useOnboarding((state) => state.setPubkey);

  const [privkeyInput, setPrivkeyInput] = useState('password');
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const privkey = useMemo(() => generatePrivateKey(), []);
  const pubkey = getPublicKey(privkey);
  const npub = nip19.npubEncode(pubkey);
  const nsec = nip19.nsecEncode(privkey);

  // toggle private key
  const showPrivateKey = () => {
    if (privkeyInput === 'password') {
      setPrivkeyInput('text');
    } else {
      setPrivkeyInput('password');
    }
  };

  const download = async () => {
    await writeTextFile(
      'lume-keys.txt',
      `Public key: ${pubkey}\nPrivate key: ${privkey}`,
      {
        dir: BaseDirectory.Download,
      }
    );
    setDownloaded(true);
  };

  const account = useMutation({
    mutationFn: (data: {
      npub: string;
      pubkey: string;
      follows: null | string[][];
      is_active: number;
    }) => {
      return createAccount(data.npub, data.pubkey, null, 1);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['currentAccount'], data);
    },
  });

  const submit = () => {
    setLoading(true);

    setPubkey(pubkey);
    setPrivkey(privkey);

    account.mutate({
      npub,
      pubkey,
      follows: null,
      is_active: 1,
    });

    // redirect to next step
    setTimeout(() => navigate('/auth/create/step-2', { replace: true }), 1200);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold text-white">Save your access key!</h1>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-white/50">Public Key</span>
          <input
            readOnly
            value={npub}
            className="relative w-full rounded-lg bg-zinc-800 py-3 pl-3.5 pr-11 text-white !outline-none placeholder:text-white/50"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-white/50">Private Key</span>
          <div className="relative">
            <input
              readOnly
              type={privkeyInput}
              value={nsec}
              className="relative w-full rounded-lg bg-zinc-800 py-3 pl-3.5 pr-11 text-white !outline-none placeholder:text-white/50"
            />
            <button
              type="button"
              onClick={() => showPrivateKey()}
              className="group absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 hover:bg-zinc-700"
            >
              {privkeyInput === 'password' ? (
                <EyeOffIcon
                  width={20}
                  height={20}
                  className="text-zinc-500 group-hover:text-white"
                />
              ) : (
                <EyeOnIcon
                  width={20}
                  height={20}
                  className="text-zinc-500 group-hover:text-white"
                />
              )}
            </button>
          </div>
          <div className="mt-2 text-sm text-zinc-500">
            <p>
              Your private key is your password. If you lose this key, you will lose
              access to your account! Copy it and keep it in a safe place. There is no way
              to reset your private key.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button preset="large" onClick={() => submit()}>
            {loading ? (
              <LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-white" />
            ) : (
              'I have saved my key, continue →'
            )}
          </Button>
          {downloaded ? (
            <span className="text-sm text-white/50">Saved in download folder</span>
          ) : (
            <Button preset="large-alt" onClick={() => download()}>
              Download
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
