import { useArk } from "@lume/ark";
import { PlusIcon } from "@lume/icons";
import { Account } from "@lume/types";
import { User } from "@lume/ui";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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
      <Link
        to="/landing"
        className="inline-flex size-7 items-center justify-center rounded-full bg-neutral-300 ring-offset-2 ring-offset-neutral-200 hover:ring-1 hover:ring-blue-500 dark:bg-neutral-700 dark:ring-offset-neutral-950"
      >
        <PlusIcon className="size-4" />
      </Link>
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
        <User.Root className="rounded-full ring-offset-2 ring-offset-neutral-200 hover:ring-1 hover:ring-blue-500 dark:ring-offset-neutral-950">
          <User.Avatar className="aspect-square h-auto w-7 rounded-full object-cover" />
        </User.Root>
      </User.Provider>
    </button>
  );
}

function Active({ pubkey }: { pubkey: string }) {
  return (
    <User.Provider pubkey={pubkey}>
      <User.Root className="rounded-full ring-1 ring-teal-500 ring-offset-2 ring-offset-neutral-200 dark:ring-offset-neutral-950">
        <User.Avatar className="aspect-square h-auto w-7 rounded-full object-cover" />
      </User.Root>
    </User.Provider>
  );
}
