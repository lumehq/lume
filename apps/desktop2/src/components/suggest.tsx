import { LoaderIcon } from "@lume/icons";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { User } from "@lume/ui";

export function Suggest() {
  const { t } = useTranslation();
  const { isLoading, isError, data } = useQuery({
    queryKey: ["trending-users"],
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const res = await fetch("https://api.nostr.band/v0/trending/profiles", {
        signal,
      });
      if (!res.ok) {
        throw new Error("Failed to fetch trending users from nostr.band API.");
      }
      return res.json();
    },
  });

  return (
    <div className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-900">
      <div className="h-10 shrink-0 text-lg font-semibold">
        Suggested Follows
      </div>
      {isLoading ? (
        <div className="flex h-44 w-full items-center justify-center">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      ) : isError ? (
        <div className="flex h-44 w-full items-center justify-center">
          {t("suggestion.error")}
        </div>
      ) : (
        data?.profiles.map((item: { pubkey: string }) => (
          <div key={item.pubkey} className="h-max w-full overflow-hidden py-5">
            <User.Provider pubkey={item.pubkey}>
              <User.Root>
                <div className="flex h-full w-full flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <User.Avatar className="size-10 shrink-0 rounded-full" />
                      <User.Name className="leadning-tight max-w-[15rem] truncate font-semibold" />
                    </div>
                    <User.Button className="inline-flex h-8 w-20 items-center justify-center rounded-lg bg-neutral-100 text-sm font-medium hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800" />
                  </div>
                  <User.About className="mt-1 line-clamp-3 max-w-none select-text text-neutral-800 dark:text-neutral-400" />
                </div>
              </User.Root>
            </User.Provider>
          </div>
        ))
      )}
    </div>
  );
}
