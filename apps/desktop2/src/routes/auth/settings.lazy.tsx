import { CheckIcon } from "@lume/icons";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import * as Switch from "@radix-ui/react-switch";
import { useEffect, useState } from "react";
import { Settings } from "@lume/types";
import { useArk } from "@lume/ark";
import {
  isPermissionGranted,
  requestPermission,
} from "@tauri-apps/plugin-notification";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/auth/settings")({
  component: Screen,
});

function Screen() {
  const ark = useArk();
  const navigate = useNavigate();

  // @ts-ignore, magic!!!
  const { account } = Route.useSearch();
  const { t } = useTranslation();

  const [settings, setSettings] = useState<Settings>({
    notification: false,
    enhancedPrivacy: false,
    autoUpdate: false,
  });

  const toggleNofitication = async () => {
    await requestPermission();
    setSettings((prev) => ({
      ...prev,
      notification: !settings.notification,
    }));
  };

  const toggleAutoUpdate = () => {
    setSettings((prev) => ({
      ...prev,
      autoUpdate: !settings.autoUpdate,
    }));
  };

  const toggleEnhancedPrivacy = () => {
    setSettings((prev) => ({
      ...prev,
      enhancedPrivacy: !settings.enhancedPrivacy,
    }));
  };

  const submit = async () => {
    try {
      const eventId = await ark.set_settings(settings);
      if (eventId) {
        navigate({ to: "/$account/home", params: { account }, replace: true });
      }
    } catch (e) {
      toast.error(e);
    }
  };

  useEffect(() => {
    async function loadSettings() {
      const permissionGranted = await isPermissionGranted(); // get notification permission
      const settings = await ark.get_settings(account);

      setSettings({ ...settings, notification: permissionGranted });
    }

    loadSettings();
  }, []);

  return (
    <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-6 px-5 xl:max-w-xl">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-teal-100 text-teal-500">
          <CheckIcon className="size-6" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">
            {t("onboardingSettings.title")}
          </h1>
          <p className="leading-snug text-neutral-600 dark:text-neutral-400">
            {t("onboardingSettings.subtitle")}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <div className="flex w-full items-start justify-between gap-4 rounded-lg bg-neutral-100 px-5 py-4 dark:bg-neutral-900">
            <Switch.Root
              checked={settings.notification}
              onClick={() => toggleNofitication()}
              className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-neutral-800"
            >
              <Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch.Root>
            <div className="flex-1">
              <h3 className="font-semibold">Push Notification</h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                Enabling push notifications will allow you to receive
                notifications from Lume.
              </p>
            </div>
          </div>
          <div className="flex w-full items-start justify-between gap-4 rounded-lg bg-neutral-100 px-5 py-4 dark:bg-neutral-900">
            <Switch.Root
              checked={settings.enhancedPrivacy}
              onClick={() => toggleEnhancedPrivacy()}
              className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-neutral-800"
            >
              <Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch.Root>
            <div className="flex-1">
              <h3 className="font-semibold">Enhanced Privacy</h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                Lume will display external resources like image, video or link
                preview as plain text.
              </p>
            </div>
          </div>
          <div className="flex w-full items-start justify-between gap-4 rounded-lg bg-neutral-100 px-5 py-4 dark:bg-neutral-900">
            <Switch.Root
              checked={settings.autoUpdate}
              onClick={() => toggleAutoUpdate()}
              className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-neutral-800"
            >
              <Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch.Root>
            <div className="flex-1">
              <h3 className="font-semibold">Auto Update</h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                Automatically download and install new version.
              </p>
            </div>
          </div>
          <div className="flex w-full items-start justify-between gap-4 rounded-lg bg-neutral-50 px-5 py-4 dark:bg-neutral-950">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              There are many more settings you can configure from the 'Settings'
              Screen. Be sure to visit it later.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={submit}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {t("global.continue")}
        </button>
      </div>
    </div>
  );
}
