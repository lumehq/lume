import { useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/auth/import")({
  component: Import,
});

function Import() {
  const ark = useArk();
  const navigate = useNavigate();

  const [t] = useTranslation();
  const [key, setKey] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!key.startsWith("nsec1")) return;
    if (key.length < 30) return;

    setLoading(true);

    try {
      const npub: string = await invoke("get_public_key", { nsec: key });
      await ark.save_account({
        npub,
        nsec: key,
      });
      navigate({
        to: "/$account/home",
        params: { account: npub },
        search: { onboarding: true },
        replace: true,
      });
    } catch (e) {
      setLoading(false);
      toast.error(e);
    }
  };

  const isNip05 = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(key);
  const isNip49 = key.startsWith("ncryptsec");

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-semibold">{t("login.title")}</h1>
          <p className="text-lg leading-snug text-neutral-600 dark:text-neutral-500">
            {t("login.subtitle")}
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div>
              <input
                value={key}
                type="text"
                onChange={(e) => setKey(e.target.value)}
                className="h-12 w-full resize-none rounded-xl border-transparent bg-neutral-100 pl-3 pr-10 placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-100 dark:bg-neutral-900 dark:focus:ring-blue-900"
              />
            </div>
            {isNip05 || isNip49 ? (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="font-medium text-neutral-900 dark:text-neutral-100"
                >
                  Password *
                </label>
                <input
                  value={password}
                  name="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full resize-none rounded-xl border-transparent bg-neutral-100 pl-3 pr-10 placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-100 dark:bg-neutral-900 dark:focus:ring-blue-900"
                />
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={submit}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-blue-500 text-lg font-medium text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              "Import"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
