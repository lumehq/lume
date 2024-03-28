import { useArk } from "@lume/ark";
import { LoaderIcon, PlusIcon } from "@lume/icons";
import { User } from "@lume/ui";
import { Link } from "@tanstack/react-router";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ search, context }) => {
    const ark = context.ark;
    const accounts = await ark.get_all_accounts();

    switch (accounts.length) {
      // Guest account
      case 0:
        throw redirect({
          to: "/landing",
          replace: true,
        });
      // Only 1 account, skip account selection screen
      case 1:
        // @ts-ignore, totally fine !!!
        if (search.manually) return;

        const account = accounts[0].npub;
        const loadedAccount = await ark.load_selected_account(account);

        if (loadedAccount) {
          throw redirect({
            to: "/$account/home",
            params: { account },
            replace: true,
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

  const [loading, setLoading] = useState(false);

  const select = async (npub: string) => {
    setLoading(true);
    const loadAccount = await ark.load_selected_account(npub);
    if (loadAccount) {
      navigate({
        to: "/$account/home",
        params: { account: npub },
        replace: true,
      });
    }
  };

  const currentDate = new Date().toLocaleString("default", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative z-20 flex flex-col items-center gap-16">
        <div className="text-center text-white">
          <h2 className="mb-1 text-2xl">{currentDate}</h2>
          <h2 className="text-2xl font-semibold">Welcome back!</h2>
        </div>
        <div className="flex items-center justify-center gap-6">
          {loading ? (
            <div className="inline-flex size-6 items-center justify-center">
              <LoaderIcon className="size-6 animate-spin text-white" />
            </div>
          ) : (
            <>
              {ark.accounts.map((account) => (
                <button
                  type="button"
                  key={account.npub}
                  onClick={() => select(account.npub)}
                >
                  <User.Provider pubkey={account.npub}>
                    <User.Root className="flex h-36 w-32 flex-col items-center justify-center gap-4 rounded-2xl p-2 hover:bg-white/10 dark:hover:bg-black/10">
                      <User.Avatar className="size-20 rounded-full object-cover" />
                      <User.Name className="max-w-[5rem] truncate text-lg font-medium leading-tight text-white" />
                    </User.Root>
                  </User.Provider>
                </button>
              ))}
              <Link to="/landing">
                <div className="flex h-36 w-32 flex-col items-center justify-center gap-4 rounded-2xl p-2 text-white hover:bg-white/10 dark:hover:bg-black/10">
                  <div className="flex size-20 items-center justify-center rounded-full bg-white/20 dark:bg-black/20">
                    <PlusIcon className="size-5" />
                  </div>
                  <p className="text-lg font-medium leading-tight">Add</p>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="absolute z-10 h-full w-full bg-white/10 backdrop-blur-lg dark:bg-black/10" />
      <div className="absolute inset-0 h-full w-full">
        <img
          src="/lock-screen.jpg"
          srcSet="/lock-screen@2x.jpg 2x"
          alt="Lock Screen Background"
          className="h-full w-full object-cover"
        />
        <a
          href="https://njump.me/nprofile1qqs9tuz9jpn57djg7nxunhyvuvk69g5zqaxdpvpqt9hwqv7395u9rpg6zq5uw"
          target="_blank"
          className="absolute bottom-3 right-3 z-50 rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white dark:bg-black/20"
        >
          Design by NoGood
        </a>
      </div>
    </div>
  );
}
