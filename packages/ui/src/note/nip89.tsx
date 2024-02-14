import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { AppHandler } from "./appHandler";
import { useNoteContext } from "./provider";
import { useArk } from "@lume/ark";

export function NIP89({ className }: { className?: string }) {
  const ark = useArk();
  const event = useNoteContext();

  const { t } = useTranslation();
  const { isLoading, isError, data } = useQuery({
    queryKey: ["app-recommend", event.id],
    queryFn: () => {
      return ark.getAppRecommend({
        unknownKind: event.kind.toString(),
        author: event.pubkey,
      });
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  if (isLoading) {
    <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Error</div>;
  }

  return (
    <div className={className}>
      <div className="flex flex-col rounded-lg bg-neutral-100 dark:bg-neutral-900">
        <div className="inline-flex h-10 shrink-0 items-center justify-between border-b border-neutral-200 px-3 dark:border-neutral-800">
          <p className="text-sm font-medium text-amber-400">
            {t("nip89.unsupported")}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {event.kind}
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-2 px-3 py-3">
          <span className="text-sm font-medium uppercase text-neutral-600 dark:text-neutral-400">
            {t("nip89.openWith")}
          </span>
          {data.map((item) => (
            <AppHandler key={item[1]} tag={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
