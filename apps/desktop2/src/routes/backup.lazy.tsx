import { createLazyFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createLazyFileRoute("/backup")({
  component: Screen,
});

function Screen() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-semibold">{t("backup.title")}</h1>
        </div>
      </div>
    </div>
  );
}
