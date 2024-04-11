import { Account } from "@lume/types";
import { User } from "@lume/ui";
import {
  useNavigate,
  useParams,
  useRouteContext,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function Accounts() {
  const { ark } = useRouteContext({ strict: false });
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
    <div data-tauri-drag-region className="flex items-center gap-3">
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
  const { ark } = useRouteContext({ strict: false });
  const navigate = useNavigate();

  const changeAccount = async (npub: string) => {
    const select = await ark.load_selected_account(npub);
    if (select) navigate({ to: "/$account/home", params: { account: npub } });
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
  return (
    <User.Provider pubkey={pubkey}>
      <User.Root className="rounded-full ring-1 ring-teal-500 ring-offset-2 ring-offset-neutral-200 dark:ring-offset-neutral-950">
        <User.Avatar className="aspect-square h-auto w-7 rounded-full object-cover" />
      </User.Root>
    </User.Provider>
  );
}
