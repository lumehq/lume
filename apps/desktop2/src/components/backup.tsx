import { ArrowRightIcon, CancelIcon } from "@lume/icons";
import * as Dialog from "@radix-ui/react-dialog";
import { Link, useParams } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { toast } from "sonner";

export function BackupDialog() {
  // @ts-ignore, magic!!!
  const { account } = useParams({ strict: false });

  const [key, setKey] = useState(null);
  const [passphase, setPassphase] = useState("");
  const [loading, setLoading] = useState(false);

  const encryptKey = async () => {
    try {
      setLoading(true);

      const encrypted: string = await invoke("get_encrypted_key", {
        npub: account,
        password: passphase,
      });

      if (encrypted) {
        setKey(encrypted);
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error(String(e));
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-neutral-900 text-sm font-medium leading-tight text-neutral-100 hover:bg-neutral-800"
        >
          Claim & Backup
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur dark:bg-white/30" />
        <Dialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <Dialog.Close className="absolute right-5 top-5 flex w-12 flex-col items-center justify-center gap-1 text-white">
            <CancelIcon className="size-8" />
            <span className="text-sm font-medium uppercase text-neutral-400 dark:text-neutral-600">
              Esc
            </span>
          </Dialog.Close>
          <div className="relative flex h-min w-full max-w-xl flex-col gap-8 rounded-xl bg-white p-5 dark:bg-black">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold">
                This is your account key
              </h3>
              <p>
                It's use for login to Lume or other Nostr clients. You will lost
                access to your account if you lose this key.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="nsec">Set a passphase to secure your key</label>
                <div className="relative">
                  <input
                    name="passphase"
                    type="password"
                    value={passphase}
                    onChange={(e) => setPassphase(e.target.value)}
                    className="h-11 w-full resize-none rounded-lg border-transparent bg-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-100 dark:bg-neutral-900 dark:focus:ring-blue-900"
                  />
                </div>
              </div>
              {key ? (
                <div className="flex flex-col gap-2">
                  <label htmlFor="nsec">
                    Copy this key and keep it in safe place
                  </label>
                  <input
                    name="nsec"
                    type="text"
                    value={key}
                    readOnly
                    className="h-11 w-full resize-none rounded-lg border-transparent bg-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-100 dark:bg-neutral-900 dark:focus:ring-blue-900"
                  />
                </div>
              ) : null}
            </div>
            <div className="flex flex-col gap-3">
              {!key ? (
                <button
                  type="button"
                  onClick={encryptKey}
                  disabled={loading}
                  className="inline-flex h-11 w-full items-center justify-between gap-1.5 rounded-lg bg-blue-500 px-5 font-medium text-white hover:bg-blue-600"
                >
                  <div className="size-5" />
                  <div>Submit</div>
                  <ArrowRightIcon className="size-5" />
                </button>
              ) : (
                <Link
                  to="/$account/home"
                  params={{ account }}
                  search={{ guest: false }}
                  className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-blue-500 px-5 font-medium text-white hover:bg-blue-600"
                >
                  I've safely store my account key
                </Link>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
