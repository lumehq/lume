import { useArk, useProfile } from "@lume/ark";
import { SettingsIcon, UserIcon } from "@lume/icons";
import { cn, useNetworkStatus } from "@lume/utils";
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { minidenticon } from "minidenticons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Logout } from "./logout";
import { Link } from "@tanstack/react-router";

export function ActiveAccount() {
  const ark = useArk();
  const isOnline = useNetworkStatus();
  const svgURI = useMemo(
    () =>
      `data:image/svg+xml;utf8,${encodeURIComponent(
        minidenticon(ark.account.npub, 90, 50),
      )}`,
    [],
  );

  const { t } = useTranslation();
  const { user } = useProfile(ark.account.npub);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="relative">
          <Avatar.Root>
            <Avatar.Image
              src={user?.picture}
              alt={ark.account.npub}
              loading="lazy"
              decoding="async"
              style={{ contentVisibility: "auto" }}
              className="aspect-square h-auto w-full rounded-xl object-cover"
            />
            <Avatar.Fallback delayMs={150}>
              <img
                src={svgURI}
                alt={ark.account.npub}
                className="aspect-square h-auto w-full rounded-xl bg-black dark:bg-white"
              />
            </Avatar.Fallback>
          </Avatar.Root>
          <span
            className={cn(
              "absolute bottom-0 right-0 block size-3 rounded-full ring-2 ring-neutral-200 dark:ring-neutral-800",
              isOnline ? "bg-teal-500" : "bg-red-500",
            )}
          />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="right"
          sideOffset={5}
          className="relative top-5 flex w-[200px] flex-col overflow-hidden rounded-2xl bg-white/50 p-2 ring-1 ring-black/10 backdrop-blur-2xl focus:outline-none dark:bg-black/50 dark:ring-white/10"
        >
          <DropdownMenu.Item asChild>
            <Link
              to="/settings/profile"
              className="inline-flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <UserIcon className="size-4" />
              {t("user.editProfile")}
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              to="/settings/"
              className="inline-flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <SettingsIcon className="size-4" />
              {t("user.settings")}
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-black/10 dark:bg-white/10" />
          <Logout />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
