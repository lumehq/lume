import {
  ArrowUpSquareIcon,
  BellFilledIcon,
  BellIcon,
  HomeFilledIcon,
  HomeIcon,
  PlusIcon,
  SearchFilledIcon,
  SearchIcon,
  SettingsFilledIcon,
  SettingsIcon,
} from "@lume/icons";
import { cn, editorAtom, searchAtom } from "@lume/utils";
import { Link } from "@tanstack/react-router";
import { confirm } from "@tauri-apps/plugin-dialog";
import { relaunch } from "@tauri-apps/plugin-process";
import { Update, check } from "@tauri-apps/plugin-updater";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ActiveAccount } from "./account/active";
import { UnreadActivity } from "./unread";

export function Navigation() {
  const [isEditorOpen, setIsEditorOpen] = useAtom(editorAtom);
  const [search, setSearch] = useAtom(searchAtom);
  const [update, setUpdate] = useState<Update>(null);

  // shortcut for editor
  useHotkeys("meta+n", () => setIsEditorOpen((state) => !state), []);

  const installNewUpdate = async () => {
    if (!update) return;

    const yes = await confirm(update.body, {
      title: `v${update.version} is available`,
      type: "info",
    });

    if (yes) {
      await update.downloadAndInstall();
      await relaunch();
    }
  };

  useEffect(() => {
    async function checkNewUpdate() {
      const newVersion = await check();
      setUpdate(newVersion);
    }
    checkNewUpdate();
  }, []);

  return (
    <div
      data-tauri-drag-region
      className="flex h-full w-20 shrink-0 flex-col justify-between px-4 py-3"
    >
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-3">
          <ActiveAccount />
          <button
            type="button"
            onClick={() => setIsEditorOpen((state) => !state)}
            className={cn(
              "inline-flex aspect-square h-auto w-full items-center justify-center rounded-xl",
              isEditorOpen
                ? "bg-blue-500 text-white"
                : "bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700 hover:dark:bg-neutral-600",
            )}
          >
            <PlusIcon className="size-5" />
          </button>
        </div>
        <div className="mx-auto my-5 h-px w-2/3 bg-black/10 dark:bg-white/10" />
        <div className="flex flex-col gap-2">
          <Link
            to="/app/space"
            className="inline-flex flex-col items-center justify-center"
          >
            {({ isActive }) => (
              <div
                className={cn(
                  "inline-flex aspect-square h-auto w-full items-center justify-center rounded-xl",
                  isActive
                    ? "bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700 hover:dark:bg-neutral-600"
                    : "text-neutral-600 dark:text-neutral-400",
                )}
              >
                {isActive ? (
                  <HomeFilledIcon className="size-6" />
                ) : (
                  <HomeIcon className="size-6" />
                )}
              </div>
            )}
          </Link>
          <Link
            to="/app/activity"
            className="inline-flex flex-col items-center justify-center"
          >
            {({ isActive }) => (
              <div
                className={cn(
                  "relative inline-flex aspect-square h-auto w-full items-center justify-center rounded-xl",
                  isActive
                    ? "bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700 hover:dark:bg-neutral-600"
                    : "text-neutral-600 dark:text-neutral-400",
                )}
              >
                {isActive ? (
                  <BellFilledIcon className="size-6" />
                ) : (
                  <BellIcon className="size-6" />
                )}
                <UnreadActivity />
              </div>
            )}
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {update ? (
          <button
            type="button"
            onClick={installNewUpdate}
            className="relative inline-flex flex-col items-center justify-center"
          >
            <span className="inline-flex items-center rounded-full bg-teal-500/60 px-2 py-1 text-xs font-semibold text-teal-50 ring-1 ring-inset ring-teal-500/80 dark:bg-teal-500/10 dark:text-teal-400 dark:ring-teal-500/20">
              Update
            </span>
            <div className="inline-flex aspect-square h-auto w-full items-center justify-center rounded-xl text-black/50 dark:text-neutral-400">
              <ArrowUpSquareIcon className="size-6" />
            </div>
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setSearch((open) => !open)}
          className="inline-flex flex-col items-center justify-center"
        >
          <div
            className={cn(
              "inline-flex aspect-square h-auto w-full items-center justify-center rounded-xl",
              search
                ? "bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700 hover:dark:bg-neutral-600"
                : "text-neutral-600 dark:text-neutral-400",
            )}
          >
            {search ? (
              <SearchFilledIcon className="size-6" />
            ) : (
              <SearchIcon className="size-6" />
            )}
          </div>
        </button>
        <Link
          to="/settings"
          className="inline-flex flex-col items-center justify-center"
        >
          {({ isActive }) => (
            <div
              className={cn(
                "inline-flex aspect-square h-auto w-full items-center justify-center rounded-xl",
                isActive
                  ? "bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700 hover:dark:bg-neutral-600"
                  : "text-neutral-600 dark:text-neutral-400",
              )}
            >
              {isActive ? (
                <SettingsFilledIcon className="size-6" />
              ) : (
                <SettingsIcon className="size-6" />
              )}
            </div>
          )}
        </Link>
      </div>
    </div>
  );
}
