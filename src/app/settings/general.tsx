import * as Switch from '@radix-ui/react-switch';
import { useEffect, useState } from 'react';

import { useStorage } from '@libs/storage/provider';

import { DarkIcon, LightIcon, SystemModeIcon } from '@shared/icons';

export function GeneralSettingScreen() {
  const { db } = useStorage();
  const [settings, setSettings] = useState({
    autolaunch: false,
    outbox: false,
    media: true,
    hashtag: true,
    notification: true,
    appearance: 'system',
  });

  useEffect(() => {
    async function loadSettings() {
      const data = await db.getAllSettings();
      if (!data) return;

      data.forEach((item) => {
        if (item.key === 'autolaunch')
          setSettings((prev) => ({
            ...prev,
            autolaunch: item.value === '1' ? true : false,
          }));

        if (item.key === 'outbox')
          setSettings((prev) => ({
            ...prev,
            outbox: item.value === '1' ? true : false,
          }));

        if (item.key === 'media')
          setSettings((prev) => ({
            ...prev,
            media: item.value === '1' ? true : false,
          }));

        if (item.key === 'hashtag')
          setSettings((prev) => ({
            ...prev,
            hashtag: item.value === '1' ? true : false,
          }));

        if (item.key === 'notification')
          setSettings((prev) => ({
            ...prev,
            notification: item.value === '1' ? true : false,
          }));

        if (item.key === 'appearance')
          setSettings((prev) => ({
            ...prev,
            appearance: item.value,
          }));
      });
    }

    loadSettings();
  }, []);

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="flex flex-col gap-6">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="w-24 shrink-0 text-end text-sm font-semibold">Startup</div>
            <div className="text-sm">Launch Lume at Login</div>
          </div>
          <Switch.Root
            checked={settings.autolaunch}
            className="relative h-7 w-12 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-neutral-800"
          >
            <Switch.Thumb className="block h-6 w-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
          </Switch.Root>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="w-24 shrink-0 text-end text-sm font-semibold">Gossip</div>
            <div className="text-sm">Use Outbox model</div>
          </div>
          <Switch.Root
            checked={settings.outbox}
            className="relative h-7 w-12 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-neutral-800"
          >
            <Switch.Thumb className="block h-6 w-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
          </Switch.Root>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="w-24 shrink-0 text-end text-sm font-semibold">Media</div>
            <div className="text-sm">Automatically load media</div>
          </div>
          <Switch.Root
            checked={settings.media}
            className="relative h-7 w-12 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-neutral-800"
          >
            <Switch.Thumb className="block h-6 w-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
          </Switch.Root>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="w-24 shrink-0 text-end text-sm font-semibold">Hashtag</div>
            <div className="text-sm">Hide all hashtags in content</div>
          </div>
          <Switch.Root
            checked={settings.hashtag}
            className="relative h-7 w-12 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-neutral-800"
          >
            <Switch.Thumb className="block h-6 w-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
          </Switch.Root>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="w-24 shrink-0 text-end text-sm font-semibold">
              Notification
            </div>
            <div className="text-sm">Automatically send notification</div>
          </div>
          <Switch.Root
            checked={settings.notification}
            className="relative h-7 w-12 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-neutral-800"
          >
            <Switch.Thumb className="block h-6 w-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
          </Switch.Root>
        </div>
        <div className="flex w-full items-start gap-8">
          <div className="w-24 shrink-0 text-end text-sm font-semibold">Appearance</div>
          <div className="flex flex-1 gap-6">
            <button
              type="button"
              className="flex flex-col items-center justify-center gap-0.5"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">
                <LightIcon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Light
              </p>
            </button>
            <button
              type="button"
              className="flex flex-col items-center justify-center gap-0.5"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">
                <DarkIcon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Dark
              </p>
            </button>
            <button
              type="button"
              className="flex flex-col items-center justify-center gap-0.5"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">
                <SystemModeIcon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                System
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
