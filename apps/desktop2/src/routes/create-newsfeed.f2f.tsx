import { ColumnRouteSearch } from "@lume/types";
import { Spinner } from "@lume/ui";
import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/create-newsfeed/f2f")({
  validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
    return {
      account: search.account,
      label: search.label,
      name: search.name,
    };
  },
  component: Screen,
});

function Screen() {
  const navigate = Route.useNavigate();
  const { redirect } = Route.useSearch();

  const [npub, setNpub] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    try {
      setIsLoading(true);

      const sync: boolean = await invoke("friend_to_friend", { npub });
      if (sync) navigate({ to: redirect });
    } catch (e) {
      setIsLoading(false);
      toast.error(String(e));
    }
  };

  return (
    <div className="overflow-y-auto scrollbar-none p-2 shrink-0 h-[450px] bg-white dark:bg-white/20 backdrop-blur-lg rounded-xl shadow-primary dark:ring-1 ring-neutral-800/50">
      <div className="h-full flex flex-col justify-between">
        <div className="flex-1 flex flex-col gap-1.5 justify-center text-lg">
          <p className="font-semibold text-neutral-500">
            You already have a friend on Nostr?
          </p>
          <p>Instead of building the timeline by yourself.</p>
          <p className="font-semibold text-neutral-500">
            Just enter your friend's <span className="text-blue-500">npub</span>
            .
          </p>
          <p>
            You will have the same experience as your friend. Of course, you
            always can edit your network later.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="npub" className="font-medium">
              NPUB
            </label>
            <input
              name="npub"
              placeholder="npub1..."
              value={npub}
              onChange={(e) => setNpub(e.target.value)}
              spellCheck={false}
              className="h-11 rounded-lg bg-transparent border border-neutral-200 dark:border-neutral-800 px-3 placeholder:text-neutral-600 focus:border-blue-500 focus:ring-0 dark:placeholder:text-neutral-400"
            />
          </div>
          <button
            type="button"
            onClick={() => submit()}
            className="inline-flex items-center justify-center w-full rounded-lg h-9 bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
          >
            {isLoading ? <Spinner /> : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
