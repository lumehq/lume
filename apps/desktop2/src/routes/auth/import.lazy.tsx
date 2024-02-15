import { useArk } from "@lume/ark";
import { EyeOffIcon, EyeOnIcon, LoaderIcon } from "@lume/icons";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createLazyFileRoute("/auth/import")({
  component: Import,
});

function Import() {
  const ark = useArk();
  const navigate = useNavigate();

  const [t] = useTranslation();
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const submit = async () => {
    if (!key.startsWith("nsec1")) return;
    if (key.length < 30) return;

    setLoading(true);

    const npub: string = await invoke("get_public_key", { nsec: key });
    const keys = {
      npub,
      nsec: key,
    };

    const save = await ark.save_account(keys);
    if (save) {
      navigate({ to: "/" });
    } else {
      console.log("import failed");
    }

    // update state
    setLoading(false);

    // next step
    navigate({ to: "/app/space", replace: true });
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold">{t("login.title")}</h1>
          <p className="text-lg leading-snug text-neutral-600 dark:text-neutral-500">
            {t("login.subtitle")}
          </p>
        </div>
        <div className="mb-0 flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="relative">
              <input
                value={key}
                type={showKey ? "text" : "password"}
                onChange={(e) => setKey(e.target.value)}
                className="h-11 w-full resize-none rounded-xl border-transparent bg-neutral-100 pl-3 pr-10 placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-100 dark:bg-neutral-900 dark:focus:ring-blue-900"
              />
              <button
                type="button"
                onClick={() => setShowKey((state) => !state)}
                className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-lg bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              >
                {showKey ? (
                  <EyeOnIcon className="size-4" />
                ) : (
                  <EyeOffIcon className="size-4" />
                )}
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={submit}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-500 text-lg font-medium text-white hover:bg-blue-600 disabled:opacity-50"
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
