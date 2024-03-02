import { InfoIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { useTranslation } from "react-i18next";

export function EmptyFeed({
  text,
  subtext,
  className,
}: {
  text?: string;
  subtext?: string;
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-2 rounded-xl bg-neutral-50 py-3 dark:bg-neutral-950",
        className,
      )}
    >
      <InfoIcon className="size-8 text-blue-500" />
      <div className="text-center">
        <p className="text-lg font-semibold">
          {text ? text : t("global.emptyFeedTitle")}
        </p>
        <p className="text-sm leading-tight">
          {subtext ? subtext : t("global.emptyFeedSubtitle")}
        </p>
      </div>
    </div>
  );
}
