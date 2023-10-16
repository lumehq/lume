import { motion } from 'framer-motion';
import { nip19 } from 'nostr-tools';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

import { useStorage } from '@libs/storage/provider';

import { ArrowLeftIcon } from '@shared/icons';
import { User } from '@shared/user';

export function ImportAccountScreen() {
  const { db } = useStorage();
  const navigate = useNavigate();

  const [npub, setNpub] = useState<string>('');
  const [nsec, setNsec] = useState<string>('');
  const [pubkey, setPubkey] = useState<undefined | string>(undefined);
  const [created, setCreated] = useState(false);
  const [savedPrivkey, setSavedPrivkey] = useState(false);

  const submitNpub = async () => {
    if (npub.length < 6) return toast('You must enter valid npub');
    if (!npub.startsWith('npub1')) return toast('npub must be starts with npub1');

    try {
      const pubkey = nip19.decode(npub).data as string;
      setPubkey(pubkey);
    } catch (e) {
      return toast(`npub invalid: ${e}`);
    }
  };

  const changeAccount = async () => {
    setNpub('');
    setPubkey('');
  };

  const createAccount = async () => {
    try {
      await db.createAccount(npub, pubkey);
      setCreated(true);
    } catch (e) {
      return toast(`Create account failed: ${e}`);
    }
  };

  const submitNsec = async () => {
    if (savedPrivkey) return;
    if (nsec.length > 50 && nsec.startsWith('nsec1')) {
      try {
        const privkey = nip19.decode(nsec).data as string;
        await db.secureSave(pubkey, privkey);
        setSavedPrivkey(true);
      } catch (e) {
        return toast(`nsec invalid: ${e}`);
      }
    }
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute left-[8px] top-4">
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
        <h1 className="text-center text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Import your Nostr account.
        </h1>
        <div className="flex flex-col gap-3">
          <div className="rounded-xl bg-neutral-100 p-3 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="npub" className="font-semibold">
                Enter your npub:
              </label>
              <div className="inline-flex w-full items-center gap-2">
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
                  className="h-11 flex-1 rounded-lg bg-neutral-200 px-3 placeholder:text-neutral-500 dark:bg-neutral-800 dark:placeholder:text-neutral-400"
                />
                {!pubkey ? (
                  <button
                    type="button"
                    onClick={submitNpub}
                    className="h-11 w-24 shrink-0 rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-600"
                  >
                    Continue
                  </button>
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
              className="rounded-xl bg-neutral-100 p-3 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
            >
              <h5 className="mb-1.5 font-semibold">Account found</h5>
              <div className="flex w-full flex-col gap-2">
                <div className="inline-flex h-full flex-1 items-center rounded-lg bg-neutral-200 p-2">
                  <User pubkey={pubkey} variant="simple" />
                </div>
                {!created ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={changeAccount}
                      className="h-9 flex-1 shrink-0 rounded-lg bg-neutral-200 font-semibold text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                    >
                      Change account
                    </button>
                    <button
                      type="button"
                      onClick={createAccount}
                      className="h-9 flex-1 shrink-0 rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-600"
                    >
                      Continue
                    </button>
                  </div>
                ) : null}
              </div>
            </motion.div>
          ) : null}
          {created ? (
            <>
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
                    Enter your nsec (optional):
                  </label>
                  <div className="inline-flex w-full items-center gap-2">
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
                      className="h-11 flex-1 rounded-lg bg-neutral-200 px-3 placeholder:text-neutral-500 dark:bg-neutral-800 dark:placeholder:text-neutral-400"
                    />
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
                  </div>
                </div>
                <div className="mt-3 select-text">
                  <p className="text-sm">
                    <b>nsec</b> is used to sign your event. For example, if you want to
                    make a new post or send a message to your contact, you need to use
                    nsec to sign this event.
                  </p>
                  <h5 className="mt-2 font-semibold">
                    1. In case you store nsec in Lume
                  </h5>
                  <p className="text-sm">
                    Lume will put your nsec to{' '}
                    {db.platform === 'macos'
                      ? 'Apple Keychain (macOS)'
                      : db.platform === 'windows'
                      ? 'Credential Manager (Windows)'
                      : 'Secret Service (Linux)'}
                    , it will be secured by your OS
                  </p>
                  <h5 className="mt-2 font-semibold">
                    2. In case you do not store nsec in Lume
                  </h5>
                  <p className="text-sm">
                    When you make an event that requires a sign by your nsec, Lume will
                    show a prompt popup for you to enter nsec. It will be cleared after
                    signing and not stored anywhere.
                  </p>
                </div>
              </motion.div>
              <motion.button
                initial={{ opacity: 0, y: 80 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="inline-flex h-9 w-full shrink-0 items-center justify-center rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-600"
                type="button"
                onClick={() =>
                  navigate('/auth/onboarding', { state: { newuser: false } })
                }
              >
                Finish
              </motion.button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
