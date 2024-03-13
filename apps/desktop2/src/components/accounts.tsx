import { useArk } from "@lume/ark";
import { Account } from "@lume/types";
import { User } from "@lume/ui";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { BackupDialog } from "./backup";
import { LoginDialog } from "./login";

export function Accounts() {
  const ark = useArk();
  const params = useParams({ strict: false });

  const [accounts, setAccounts] = useState<Account[]>(null);

  useEffect(() => {
    async function getAllAccounts() {
      const data = await ark.get_all_accounts();
      if (data) setAccounts(data);
    }

    getAllAccounts();
  }, []);

  return (
    <div data-tauri-drag-region className="flex items-center gap-4">
      {accounts
        ? accounts.map((account) =>
            // @ts-ignore, useless
            account.npub === params.account ? (
              <Active key={account.npub} pubkey={account.npub} />
            ) : (
              <Inactive key={account.npub} pubkey={account.npub} />
            ),
          )
        : null}
    </div>
  );
}

function Inactive({ pubkey }: { pubkey: string }) {
  const ark = useArk();
  const navigate = useNavigate();

  const changeAccount = async (npub: string) => {
    const select = await ark.load_selected_account(npub);
    if (select)
      navigate({ to: "/$account/home/local", params: { account: npub } });
  };

  return (
    <button type="button" onClick={() => changeAccount(pubkey)}>
      <User.Provider pubkey={pubkey}>
        <User.Root className="rounded-full">
          <User.Avatar className="aspect-square h-auto w-8 rounded-full object-cover" />
        </User.Root>
      </User.Provider>
    </button>
  );
}

function Active({ pubkey }: { pubkey: string }) {
  const ark = useArk();
  const navigate = useNavigate();

  // @ts-ignore, magic !!!
  const { guest } = useSearch({ strict: false });
  // @ts-ignore, magic !!!
  const { account } = useParams({ strict: false });

  if (guest) {
    return (
      <Popover.Root open={true}>
        <Popover.Trigger asChild>
          <button type="button">
            <User.Provider pubkey={pubkey}>
              <User.Root className="rounded-full ring-1 ring-teal-500 ring-offset-2 ring-offset-neutral-200 dark:ring-offset-neutral-950">
                <User.Avatar className="aspect-square h-auto w-7 rounded-full object-cover" />
              </User.Root>
            </User.Provider>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="flex w-[280px] flex-col gap-4 rounded-xl bg-black p-5 text-neutral-100 focus:outline-none dark:bg-white dark:text-neutral-900 dark:shadow-none"
            sideOffset={10}
            side="bottom"
          >
            <div>
              <h1 className="mb-1 font-semibold">
                You're using random account
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-600">
                You can continue by claim and backup this account, or you can
                import your own account.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <BackupDialog />
              <LoginDialog />
            </div>
            <Popover.Arrow className="fill-black dark:fill-white" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <User.Provider pubkey={pubkey}>
          <User.Root className="rounded-full ring-1 ring-teal-500 ring-offset-2 ring-offset-neutral-200 dark:ring-offset-neutral-950">
            <User.Avatar className="aspect-square h-auto w-7 rounded-full object-cover" />
          </User.Root>
        </User.Provider>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="flex w-[220px] flex-col rounded-xl bg-black p-2 text-neutral-100 focus:outline-none dark:bg-white dark:text-neutral-900 dark:shadow-none"
          sideOffset={10}
          side="bottom"
        >
          <DropdownMenu.Item className="group relative flex h-9 select-none items-center rounded-md px-3 text-sm font-medium leading-none outline-none hover:bg-neutral-900 dark:hover:bg-neutral-100">
            Add account
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => ark.open_profile(account)}
            className="group relative flex h-9 select-none items-center rounded-md px-3 text-sm font-medium leading-none outline-none hover:bg-neutral-900 dark:hover:bg-neutral-100"
          >
            Profile
            <div className="ml-auto pl-5 text-xs text-neutral-800 dark:text-neutral-200">
              ⌘+Shift+P
            </div>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => navigate({ to: "/", search: { manually: true } })}
            className="group relative flex h-9 select-none items-center rounded-md px-3 text-sm font-medium leading-none outline-none hover:bg-neutral-900 dark:hover:bg-neutral-100"
          >
            Logout
            <div className="ml-auto pl-5 text-xs text-neutral-800 dark:text-neutral-200">
              ⌘+Shift+L
            </div>
          </DropdownMenu.Item>
          <DropdownMenu.Arrow className="fill-black dark:fill-white" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
