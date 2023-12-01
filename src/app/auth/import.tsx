import NDK, { NDKNip46Signer, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { readText } from '@tauri-apps/plugin-clipboard-manager';
import { motion } from 'framer-motion';
import { nip19 } from 'nostr-tools';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { ArrowLeftIcon, LoaderIcon } from '@shared/icons';
import { User } from '@shared/user';

export function ImportAccountScreen() {
  const { db } = useStorage();
  const { ndk } = useNDK();

  const [npub, setNpub] = useState<string>('');
  const [nsec, setNsec] = useState<string>('');
  const [pubkey, setPubkey] = useState<undefined | string>(undefined);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState({ ok: false, remote: false });
  const [savedPrivkey, setSavedPrivkey] = useState(false);

  const navigate = useNavigate();

  const submitNpub = async () => {
    if (npub.length < 6) return toast.error('You must enter valid npub');
    if (!npub.startsWith('npub1')) return toast.error('npub must be starts with npub1');

    try {
      const pubkey = nip19.decode(npub).data as string;
      setPubkey(pubkey);
    } catch (e) {
      return toast.error(`npub invalid: ${e}`);
    }
  };

  const connectNsecBunker = async () => {
    if (npub.length < 6) return toast.error('You must enter valid npub');
    if (!npub.startsWith('npub1')) return toast.error('npub must be starts with npub1');

    try {
      const pubkey = nip19.decode(npub.split('#')[0]).data as string;
      const localSigner = NDKPrivateKeySigner.generate();

      await db.createSetting('nsecbunker', '1');
      await db.secureSave(`${pubkey}-nsecbunker`, localSigner.privateKey);

      const bunker = new NDK({
        explicitRelayUrls: ['wss://relay.nsecbunker.com', 'wss://nostr.vulpem.com'],
      });
      bunker.connect();

      const remoteSigner = new NDKNip46Signer(bunker, npub, localSigner);
      await remoteSigner.blockUntilReady();

      ndk.signer = remoteSigner;

      setPubkey(pubkey);
      setCreated({ ok: false, remote: true });
    } catch (e) {
      return toast.error(e);
    }
  };

  const changeAccount = async () => {
    setNpub('');
    setPubkey('');
  };

  const createAccount = async () => {
    try {
      setLoading(true);

      // add account to db
      await db.createAccount(npub, pubkey);

      // get account metadata
      const user = ndk.getUser({ pubkey });
      if (user) {
        db.account.contacts = [...(await user.follows())].map((user) => user.pubkey);
        db.account.relayList = await user.relayList();
      }

      setCreated((prev) => ({ ...prev, ok: true }));
      setLoading(false);

      if (created.remote) navigate('/auth/onboarding');
    } catch (e) {
      setLoading(false);
      return toast.error(e);
    }
  };

  const pasteNsec = async () => {
    const tempNsec = await readText();
    setNsec(tempNsec);
  };

  const submitNsec = async () => {
    if (savedPrivkey) return;
    if (nsec.length > 50 && nsec.startsWith('nsec1')) {
      try {
        const privkey = nip19.decode(nsec).data as string;
        await db.secureSave(pubkey, privkey);

        ndk.signer = new NDKPrivateKeySigner(privkey);

        setSavedPrivkey(true);
      } catch (e) {
        return toast(`nsec invalid: ${e}`);
      }
    }
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute left-[8px] top-2">
        {!created ? (
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium"
          >
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
              <ArrowLeftIcon className="h-5 w-5" />
            </div>
            Back
          </button>
        ) : null}
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col gap-10">
        <h1 className="text-center text-2xl font-semibold">Import your account.</h1>
        <div className="flex flex-col gap-3">
          <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-950">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="npub" className="font-semibold">
                Enter your public key:
              </label>
              <div className="flex w-full flex-col gap-2">
                <input
                  name="npub"
                  type="text"
                  value={npub}
                  onChange={(e) => setNpub(e.target.value)}
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  placeholder="npub1"
                  className="h-11 rounded-lg border-transparent bg-neutral-100 px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-900 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
                />
                {!pubkey ? (
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={submitNpub}
                      className="h-11 w-full shrink-0 rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-600"
                    >
                      Continue
                    </button>
                    <button
                      type="button"
                      onClick={connectNsecBunker}
                      className="h-11 w-full shrink-0 rounded-lg bg-neutral-200 font-medium hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                    >
                      Continue with nsecBunker
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          {pubkey ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-950"
            >
              <h5 className="mb-1.5 font-semibold">Account found</h5>
              <div className="flex w-full flex-col gap-2">
                <div className="flex h-full w-full items-center justify-between rounded-lg bg-neutral-100 px-4 py-3 dark:bg-neutral-900">
                  <User pubkey={pubkey} variant="simple" />
                  <button
                    type="button"
                    onClick={changeAccount}
                    className="h-8 w-20 shrink-0 rounded-lg bg-neutral-200 text-sm font-medium hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                  >
                    Change
                  </button>
                </div>
                {!created.ok ? (
                  <button
                    type="button"
                    onClick={createAccount}
                    className="inline-flex h-11 w-full shrink-0 items-center justify-center rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-600"
                  >
                    {loading ? (
                      <LoaderIcon className="h-4 w-4 animate-spin" />
                    ) : (
                      'Continue'
                    )}
                  </button>
                ) : null}
              </div>
            </motion.div>
          ) : null}
          {created.ok ? (
            <>
              {!created.remote ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="rounded-lg bg-neutral-100 p-3 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
                >
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="nsec" className="font-semibold">
                      Enter your private key (optional):
                    </label>
                    <div className="inline-flex w-full items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          name="nsec"
                          type="text"
                          value={nsec}
                          onChange={(e) => setNsec(e.target.value)}
                          spellCheck={false}
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          placeholder="nsec1"
                          className="h-11 w-full rounded-lg border-transparent bg-neutral-200 px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-800 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
                        />
                        {nsec.length < 5 ? (
                          <div className="absolute right-0 top-0 inline-flex h-11 items-center justify-center px-2">
                            <button
                              type="button"
                              onClick={pasteNsec}
                              className="rounded-md bg-neutral-300 px-2 py-1 text-sm font-medium hover:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                            >
                              Paste
                            </button>
                          </div>
                        ) : null}
                      </div>
                      {nsec.length > 5 ? (
                        <button
                          type="button"
                          onClick={submitNsec}
                          className={twMerge(
                            'h-11 w-24 shrink-0 rounded-lg font-semibold text-white',
                            !savedPrivkey
                              ? 'bg-blue-500 hover:bg-blue-600'
                              : 'bg-teal-500 hover:bg-teal-600'
                          )}
                        >
                          {savedPrivkey ? 'Saved' : 'Save'}
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-3 select-text">
                    <p className="text-sm">
                      <b>Private Key</b> is used to sign your event. For example, if you
                      want to make a new post or send a message to your contact, you need
                      to use your private key to sign this event.
                    </p>
                    <h5 className="mt-2 font-semibold">
                      1. In case you store private key in Lume
                    </h5>
                    <p className="text-sm">
                      Lume will put your private key to{' '}
                      <b>
                        {db.platform === 'macos'
                          ? 'Apple Keychain (macOS)'
                          : db.platform === 'windows'
                            ? 'Credential Manager (Windows)'
                            : 'Secret Service (Linux)'}
                      </b>
                      , it will be secured by your OS
                    </p>
                    <h5 className="mt-2 font-semibold">
                      2. In case you do not store private key in Lume
                    </h5>
                    <p className="text-sm">
                      When you make an event that requires a sign by your private key,
                      Lume will show a prompt for you to enter private key. It will be
                      cleared after signing and not stored anywhere.
                    </p>
                  </div>
                </motion.div>
              ) : null}
              <motion.button
                initial={{ opacity: 0, y: 80 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="inline-flex h-11 w-full shrink-0 items-center justify-center rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-600"
                type="button"
                onClick={() => navigate('/auth/onboarding')}
              >
                Continue
              </motion.button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
