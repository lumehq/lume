import { useArk } from "@lume/ark";
import { ArrowRightIcon, CancelIcon } from "@lume/icons";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export function LoginDialog() {
  const ark = useArk();
  const navigate = useNavigate();

  const [nsec, setNsec] = useState("");
  const [passphase, setPassphase] = useState("");

  const login = async () => {
    try {
      if (!nsec.length) {
        return toast.info("You must enter a valid nsec or ncrypto");
      }

      if (nsec.startsWith("ncrypto") && !passphase.length) {
        return toast.warning("You must provide a passphase for ncrypto key");
      }

      const save = await ark.save_account(nsec, passphase);

      if (save) {
        navigate({ to: "/", search: { guest: false } });
      }
    } catch (e) {
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
          Add account
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
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-semibold">Add new account with</h3>
              <div className="flex h-11 items-center overflow-hidden rounded-lg bg-neutral-100 p-1 dark:bg-neutral-900">
                <button
                  type="button"
                  className="h-full flex-1 rounded-md bg-white text-sm font-medium dark:bg-black"
                >
                  nsec
                </button>
                <button
                  type="button"
                  className="flex h-full flex-1 flex-col items-center justify-center rounded-md text-sm font-medium"
                >
                  <span className="leading-tight">nsecBunker</span>
                  <span className="text-xs font-normal leading-tight text-neutral-700 dark:text-neutral-300">
                    coming soon
                  </span>
                </button>
                <button
                  type="button"
                  className="flex h-full flex-1 flex-col items-center justify-center rounded-md text-sm font-medium"
                >
                  <span className="leading-tight">Address</span>
                  <span className="text-xs font-normal leading-tight text-neutral-700 dark:text-neutral-300">
                    coming soon
                  </span>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="nsec">
                  Enter sign in key start with nsec or ncrypto
                </label>
                <input
                  name="nsec"
                  type="text"
                  placeholder="nsec or ncrypto..."
                  value={nsec}
                  onChange={(e) => setNsec(e.target.value)}
                  className="h-11 w-full resize-none rounded-lg border-transparent bg-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-100 dark:bg-neutral-900 dark:focus:ring-blue-900"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="nsec">Passphase (optional)</label>
                <input
                  name="passphase"
                  type="password"
                  value={passphase}
                  onChange={(e) => setPassphase(e.target.value)}
                  className="h-11 w-full resize-none rounded-lg border-transparent bg-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-100 dark:bg-neutral-900 dark:focus:ring-blue-900"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={login}
                className="inline-flex h-11 w-full items-center justify-between gap-1.5 rounded-lg bg-blue-500 px-5 font-medium text-white hover:bg-blue-600"
              >
                <div className="size-5" />
                <div>Add account</div>
                <ArrowRightIcon className="size-5" />
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
