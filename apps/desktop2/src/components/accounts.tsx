import { useArk } from "@lume/ark";
import { User } from "@lume/ui";

export function Accounts() {
  const ark = useArk();

  return (
    <div data-tauri-drag-region className="flex items-center gap-4">
      {ark.accounts.map((account) =>
        account.npub === ark.account.npub ? (
          <Active pubkey={account.npub} />
        ) : (
          <Inactive pubkey={ark.account.npub} />
        ),
      )}
    </div>
  );
}

function Inactive({ pubkey }: { pubkey: string }) {
  return (
    <User.Provider pubkey={pubkey}>
      <User.Root className="rounded-full ring-offset-2 ring-offset-neutral-200 hover:ring-1 hover:ring-blue-500 dark:ring-offset-neutral-950">
        <User.Avatar className="aspect-square h-auto w-7 rounded-full object-cover" />
      </User.Root>
    </User.Provider>
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
