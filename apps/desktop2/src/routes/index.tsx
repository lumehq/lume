import { useArk } from "@lume/ark";
import { User } from "@lume/ui";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ location, context }) => {
    const ark = context.ark;
    const accounts = await ark.get_all_accounts();

    switch (accounts.length) {
      // Empty account
      case 0:
        throw redirect({
          to: "/landing",
          search: {
            redirect: location.href,
          },
        });
      // Only 1 account, skip account selection screen
      case 1:
        const loadAccount = await ark.load_selected_account(accounts[0].npub);
        if (loadAccount) {
          throw redirect({
            to: "/app/home",
            search: {
              redirect: location.href,
            },
          });
        }
      // Account selection
      default:
        return;
    }
  },
  component: Screen,
});

function Screen() {
  const ark = useArk();
  const navigate = useNavigate();

  const select = async (npub: string) => {
    const loadAccount = await ark.load_selected_account(npub);
    if (loadAccount) {
      navigate({
        to: "/app/home",
        replace: true,
      });
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex items-center gap-6">
        {ark.accounts.map((account) => (
          <button
            type="button"
            key={account.npub}
            onClick={() => select(account.npub)}
          >
            <User.Provider pubkey={account.npub}>
              <User.Root className="flex h-36 w-32 flex-col items-center justify-center gap-4 rounded-xl p-2 hover:bg-neutral-100 dark:bg-neutral-900">
                <User.Avatar className="size-20 rounded-full object-cover" />
                <User.Name className="max-w-[5rem] truncate text-lg font-medium leading-tight" />
              </User.Root>
            </User.Provider>
          </button>
        ))}
      </div>
    </div>
  );
}
