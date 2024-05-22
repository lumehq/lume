import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { Await, defer } from "@tanstack/react-router";
import { User } from "@/components/user";
import { Spinner } from "@lume/ui";
import { toast } from "sonner";
import { ColumnRouteSearch } from "@lume/types";

export const Route = createFileRoute("/create-newsfeed/users")({
  validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
    return {
      account: search.account,
      label: search.label,
      name: search.name,
    };
  },
  loader: async ({ abortController }) => {
    try {
      return {
        data: defer(
          fetch("https://api.nostr.band/v0/trending/profiles", {
            signal: abortController.signal,
          }).then((res) => res.json()),
        ),
      };
    } catch (e) {
      throw new Error(String(e));
    }
  },
  component: Screen,
});

function Screen() {
  const { ark } = Route.useRouteContext();
  const { data } = Route.useLoaderData();
  const { redirect } = Route.useSearch();

  const [isLoading, setIsLoading] = useState(false);
  const [follows, setFollows] = useState<string[]>([]);

  const navigate = Route.useNavigate();

  const toggleFollow = (pubkey: string) => {
    setFollows((prev) =>
      prev.includes(pubkey)
        ? prev.filter((i) => i !== pubkey)
        : [...prev, pubkey],
    );
  };

  const submit = async () => {
    try {
      setIsLoading(true);

      const newContactList = await ark.set_contact_list(follows);

      if (newContactList) {
        return navigate({ to: redirect });
      }
    } catch (e) {
      setIsLoading(false);
      toast.error(String(e));
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="overflow-y-auto scrollbar-none p-2 shrink-0 w-full h-[450px] bg-black/5 dark:bg-white/5 backdrop-blur-lg rounded-xl">
        <Suspense
          fallback={
            <div className="flex h-20 w-full flex-col items-center justify-center gap-1">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-medium"
                disabled
              >
                <Spinner className="size-5" />
                Loading...
              </button>
            </div>
          }
        >
          <Await promise={data}>
            {(users) =>
              users.profiles.map((item: { pubkey: string }) => (
                <div
                  key={item.pubkey}
                  className="h-max w-full overflow-hidden mb-2 p-2 bg-white dark:bg-black/20 backdrop-blur-lg rounded-lg shadow-primary dark:ring-1 ring-neutral-800/50"
                >
                  <User.Provider pubkey={item.pubkey}>
                    <User.Root>
                      <div className="flex h-full w-full flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User.Avatar className="size-7 shrink-0 rounded-full object-cover" />
                            <User.Name className="text-sm leadning-tight max-w-[15rem] truncate font-semibold" />
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleFollow(item.pubkey)}
                            className="inline-flex h-7 w-20 items-center justify-center rounded-lg bg-black/10 text-sm font-medium hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
                          >
                            {follows.includes(item.pubkey)
                              ? "Unfollow"
                              : "Follow"}
                          </button>
                        </div>
                        <User.About className="line-clamp-3 max-w-none select-text text-neutral-800 dark:text-neutral-400" />
                      </div>
                    </User.Root>
                  </User.Provider>
                </div>
              ))
            }
          </Await>
        </Suspense>
      </div>
      <button
        type="button"
        onClick={() => submit()}
        disabled={isLoading || follows.length < 1}
        className="inline-flex items-center justify-center w-36 rounded-full h-9 bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? <Spinner /> : "Confirm"}
      </button>
    </div>
  );
}
