import { useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/auth/privkey")({
  component: Screen,
});

function Screen() {
  const ark = useArk();
  const navigate = useNavigate();

  const [t] = useTranslation();
  const [key, setKey] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!key.startsWith("nsec1"))
      return toast.warning(
        "You need to enter a valid private key starts with nsec or ncryptsec",
      );
    if (key.length < 30)
      return toast.warning("You need to enter a valid private key");

    setLoading(true);

    try {
      const npub = await ark.save_account(key, password);
      navigate({
        to: "/$account/home",
        params: { account: npub },
        search: { onboarding: true },
        replace: true,
      });
    } catch (e) {
      toast.error(e);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-semibold">{t("login.title")}</h1>
          <p className="text-lg leading-snug text-neutral-600 dark:text-neutral-500">
            {t("login.subtitle")}
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="key"
                className="font-medium text-neutral-900 dark:text-neutral-100"
              >
                Private Key
              </label>
              <input
                name="key"
                type="text"
                placeholder="nsec or ncryptsec..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="h-11 w-full rounded-lg border-transparent bg-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-100 dark:bg-neutral-900 dark:focus:ring-blue-900"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="font-medium text-neutral-900 dark:text-neutral-100"
              >
                Password (Optional)
              </label>
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-lg border-transparent bg-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-100 dark:bg-neutral-900 dark:focus:ring-blue-900"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-blue-500 text-lg font-medium text-white hover:bg-blue-600"
          >
            {loading ? <LoaderIcon className="size-5 animate-spin" /> : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
