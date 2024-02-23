import { useArk } from "@lume/ark";
import { CheckIcon, EyeOffIcon, EyeOnIcon, LoaderIcon } from "@lume/icons";
import { Keys } from "@lume/types";
import * as Checkbox from "@radix-ui/react-checkbox";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/auth/create/self")({
  component: Create,
});

function Create() {
  const ark = useArk();
  const navigate = useNavigate();

  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [confirm, setConfirm] = useState({ c1: false, c2: false, c3: false });
  const [keys, setKeys] = useState<Keys>(null);

  const submit = async () => {
    setLoading(true);
    try {
      await ark.save_account(keys);
      navigate({
        to: "/app/home/local",
        search: { onboarding: true },
        replace: true,
      });
    } catch (e) {
      setLoading(false);
      toast.error(e);
    }
  };

  useEffect(() => {
    async function genKeys() {
      const res = await ark.create_keys();
      setKeys(res);
    }
    genKeys();
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-semibold">
            {t("signupWithSelfManage.title")}
          </h1>
          <p className="text-lg leading-snug text-neutral-600 dark:text-neutral-500">
            {t("signupWithSelfManage.subtitle")}
          </p>
        </div>
        <div className="mb-0 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              {keys ? (
                <input
                  readOnly
                  value={keys.nsec}
                  type={showKey ? "text" : "password"}
                  className="h-12 w-full resize-none rounded-xl border-transparent bg-neutral-100 pl-3 pr-14 placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-100 dark:bg-neutral-900 dark:focus:ring-blue-900"
                />
              ) : null}
              <button
                type="button"
                onClick={() => setShowKey((state) => !state)}
                className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-lg bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              >
                {showKey ? (
                  <EyeOnIcon className="size-4" />
                ) : (
                  <EyeOffIcon className="size-4" />
                )}
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Checkbox.Root
                  checked={confirm.c1}
                  onCheckedChange={() =>
                    setConfirm((state) => ({ ...state, c1: !state.c1 }))
                  }
                  className="flex size-7 appearance-none items-center justify-center rounded-lg bg-neutral-100 outline-none dark:bg-neutral-900"
                  id="confirm1"
                >
                  <Checkbox.Indicator className="text-blue-500">
                    <CheckIcon className="size-4" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label
                  className="text-sm text-neutral-700 dark:text-neutral-400"
                  htmlFor="confirm1"
                >
                  {t("signupWithSelfManage.confirm1")}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox.Root
                  checked={confirm.c3}
                  onCheckedChange={() =>
                    setConfirm((state) => ({ ...state, c3: !state.c3 }))
                  }
                  className="flex size-7 appearance-none items-center justify-center rounded-lg bg-neutral-100 outline-none dark:bg-neutral-900"
                  id="confirm3"
                >
                  <Checkbox.Indicator className="text-blue-500">
                    <CheckIcon className="size-4" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label
                  className="text-sm text-neutral-700 dark:text-neutral-400"
                  htmlFor="confirm3"
                >
                  {t("signupWithSelfManage.confirm3")}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox.Root
                  checked={confirm.c2}
                  onCheckedChange={() =>
                    setConfirm((state) => ({ ...state, c2: !state.c2 }))
                  }
                  className="flex size-7 appearance-none items-center justify-center rounded-lg bg-neutral-100 outline-none dark:bg-neutral-900"
                  id="confirm2"
                >
                  <Checkbox.Indicator className="text-blue-500">
                    <CheckIcon className="size-4" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label
                  className="text-sm text-neutral-700 dark:text-neutral-400"
                  htmlFor="confirm2"
                >
                  {t("signupWithSelfManage.confirm2")}
                </label>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={!confirm.c1 || !confirm.c2 || !confirm.c3}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-blue-500 text-lg font-medium text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              t("signupWithSelfManage.button")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
