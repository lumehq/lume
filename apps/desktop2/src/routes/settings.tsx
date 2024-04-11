import { SettingsIcon, UserIcon, ZapIcon, SecureIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { Link } from "@tanstack/react-router";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/settings")({
  component: Screen,
});

function Screen() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full flex-col bg-neutral-100 dark:bg-neutral-950">
      <div
        data-tauri-drag-region
        className="flex h-20 w-full shrink-0 items-center justify-center border-b border-neutral-200 dark:border-neutral-800"
      >
        <div className="flex items-center gap-1">
          <Link to="/settings/general">
            {({ isActive }) => {
              return (
                <div
                  className={cn(
                    "flex h-14 w-20 shrink-0 flex-col items-center justify-center rounded-lg p-2",
                    isActive
                      ? "bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                      : "text-neutral-700 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800",
                  )}
                >
                  <SettingsIcon className="size-5 shrink-0" />
                  <p className="text-sm font-medium">
                    {t("settings.general.title")}
                  </p>
                </div>
              );
            }}
          </Link>
          <Link to="/settings/user">
            {({ isActive }) => {
              return (
                <div
                  className={cn(
                    "flex h-14 w-20 shrink-0 flex-col items-center justify-center rounded-lg p-2",
                    isActive
                      ? "bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                      : "text-neutral-700 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800",
                  )}
                >
                  <UserIcon className="size-5 shrink-0" />
                  <p className="text-sm font-medium">
                    {t("settings.user.title")}
                  </p>
                </div>
              );
            }}
          </Link>
          <Link to="/settings/zap">
            {({ isActive }) => {
              return (
                <div
                  className={cn(
                    "flex h-14 w-20 shrink-0 flex-col items-center justify-center rounded-lg p-2",
                    isActive
                      ? "bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                      : "text-neutral-700 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800",
                  )}
                >
                  <ZapIcon className="size-5 shrink-0" />
                  <p className="text-sm font-medium">
                    {t("settings.zap.title")}
                  </p>
                </div>
              );
            }}
          </Link>
          <Link to="/settings/backup">
            {({ isActive }) => {
              return (
                <div
                  className={cn(
                    "flex h-14 w-20 shrink-0 flex-col items-center justify-center rounded-lg p-2",
                    isActive
                      ? "bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                      : "text-neutral-700 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800",
                  )}
                >
                  <SecureIcon className="size-5 shrink-0" />
                  <p className="text-sm font-medium">
                    {t("settings.backup.title")}
                  </p>
                </div>
              );
            }}
          </Link>
        </div>
      </div>
      <div className="w-full flex-1 overflow-y-auto px-5 py-4">
        <div className="mx-auto w-full max-w-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
