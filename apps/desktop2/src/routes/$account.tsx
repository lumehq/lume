import {
  BellIcon,
  ComposeFilledIcon,
  HorizontalDotsIcon,
  PlusIcon,
  SearchIcon,
} from "@lume/icons";
import { type NostrEvent, Kind } from "@lume/types";
import { User } from "@/components/user";
import {
  cn,
  decodeZapInvoice,
  displayNpub,
  sendNativeNotification,
} from "@lume/utils";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { getCurrent } from "@tauri-apps/api/window";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import * as Popover from "@radix-ui/react-popover";
import { LumeWindow, NostrAccount, NostrQuery } from "@lume/system";
import { Link } from "@tanstack/react-router";

type AccountSearch = {
  accounts?: string[];
};

export const Route = createFileRoute("/$account")({
  validateSearch: (search: Record<string, unknown>): AccountSearch => {
    return {
      accounts: (search?.accounts as string[]) || [],
    };
  },
  component: Screen,
});

function Screen() {
  const { platform } = Route.useRouteContext();

  return (
    <div className="flex h-screen w-screen flex-col">
      <div
        data-tauri-drag-region
        className={cn(
          "flex h-11 shrink-0 items-center justify-between pr-2",
          platform === "macos" ? "ml-2 pl-20" : "pl-4",
        )}
      >
        <div className="flex items-center gap-3">
          <Accounts />
          <Link
            to="/landing/"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-black/10 text-neutral-800 hover:bg-black/20 dark:bg-white/10 dark:text-neutral-200 dark:hover:bg-white/20"
          >
            <PlusIcon className="size-5" />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => LumeWindow.openEditor()}
            className="inline-flex h-8 w-max items-center justify-center gap-1 rounded-full bg-blue-500 px-3 text-sm font-medium text-white hover:bg-blue-600"
          >
            <ComposeFilledIcon className="size-4" />
            New Post
          </button>
          <Bell />
          <button
            type="button"
            onClick={() => LumeWindow.openSearch()}
            className="inline-flex size-8 items-center justify-center rounded-full text-neutral-800 hover:bg-black/10 dark:text-neutral-200 dark:hover:bg-white/10"
          >
            <SearchIcon className="size-5" />
          </button>
          <div id="toolbar" />
        </div>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

function Accounts() {
  const { accounts } = Route.useSearch();
  const { account } = Route.useParams();

  const [windowWidth, setWindowWidth] = useState<number>(null);

  const navigate = Route.useNavigate();
  const sortedList = useMemo(() => {
    const list = accounts;

    for (const [i, item] of list.entries()) {
      if (item === account) {
        list.splice(i, 1);
        list.unshift(item);
      }
    }

    return list;
  }, [accounts]);

  const changeAccount = async (npub: string) => {
    if (npub === account) {
      return await LumeWindow.openProfile(account);
    }

    // change current account and update signer
    const select = await NostrAccount.loadAccount(npub);

    if (select) {
      return navigate({ to: "/$account/home", params: { account: npub } });
    } else {
      toast.warning("Something wrong.");
    }
  };

  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  };

  useEffect(() => {
    function handleResize() {
      setWindowWidth(getWindowDimensions().width);
    }

    if (!windowWidth) setWindowWidth(getWindowDimensions().width);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div data-tauri-drag-region className="flex items-center gap-3">
      {sortedList
        .slice(0, windowWidth > 500 ? account.length : 2)
        .map((user) => (
          <button key={user} type="button" onClick={() => changeAccount(user)}>
            <User.Provider pubkey={user}>
              <User.Root
                className={cn(
                  "shrink-0 rounded-full transition-all ease-in-out duration-150 will-change-auto",
                  user === account
                    ? "ring-1 ring-teal-500 ring-offset-2 ring-offset-neutral-200 dark:ring-offset-neutral-950"
                    : "",
                )}
              >
                <User.Avatar
                  className={cn(
                    "aspect-square h-auto rounded-full object-cover transition-all ease-in-out duration-150 will-change-auto",
                    user === account ? "w-7" : "w-8",
                  )}
                />
              </User.Root>
            </User.Provider>
          </button>
        ))}
      {accounts.length >= 3 && windowWidth <= 700 ? (
        <Popover.Root>
          <Popover.Trigger className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-black/10 text-neutral-800 hover:bg-black/20 dark:bg-white/10 dark:text-neutral-200 dark:hover:bg-white/20">
            <HorizontalDotsIcon className="size-5" />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="flex h-11 select-none items-center justify-center rounded-md bg-neutral-950 p-1 text-sm text-neutral-50 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-50 dark:text-neutral-950">
              {sortedList.slice(2).map((user) => (
                <button
                  key={user}
                  type="button"
                  onClick={() => changeAccount(user)}
                  className="size-9 inline-flex items-center justify-center hover:bg-white/10 rounded-md"
                >
                  <User.Provider pubkey={user}>
                    <User.Root className="rounded-full ring-1 ring-white/10">
                      <User.Avatar className="size-7 aspect-square h-auto rounded-full object-cover" />
                    </User.Root>
                  </User.Provider>
                </button>
              ))}
              <Popover.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      ) : null}
    </div>
  );
}

function Bell() {
  const { account } = Route.useParams();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const unlisten = getCurrent().listen<string>(
      "activity",
      async (payload) => {
        setCount((prevCount) => prevCount + 1);
        await invoke("set_badge", { count });

        const event: NostrEvent = JSON.parse(payload.payload);
        const user = await NostrQuery.getProfile(event.pubkey);
        const userName =
          user.display_name || user.name || displayNpub(event.pubkey, 16);

        switch (event.kind) {
          case Kind.Text: {
            sendNativeNotification("Mentioned you in a note", userName);
            break;
          }
          case Kind.Repost: {
            sendNativeNotification("Reposted your note", userName);
            break;
          }
          case Kind.ZapReceipt: {
            const amount = decodeZapInvoice(event.tags);
            sendNativeNotification(
              `Zapped ₿ ${amount.bitcoinFormatted}`,
              userName,
            );
            break;
          }
          default:
            break;
        }
      },
    );

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        setCount(0);
        LumeWindow.openActivity(account);
      }}
      className="relative inline-flex size-8 items-center justify-center rounded-full text-neutral-800 hover:bg-black/10 dark:text-neutral-200 dark:hover:bg-white/10"
    >
      <BellIcon className="size-5" />
      {count > 0 ? (
        <span className="absolute right-0 top-0 block size-2 rounded-full bg-teal-500 ring-1 ring-black/5" />
      ) : null}
    </button>
  );
}
