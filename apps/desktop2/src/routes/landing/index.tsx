import { Link, createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/landing/")({
  component: Screen,
});

function Screen() {
  const context = Route.useRouteContext();
  const { t } = useTranslation();

  return (
    <div className="flex h-screen w-screen bg-black">
      <div className="flex h-full w-full flex-col items-center justify-between">
        <div />
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10">
          <div className="flex flex-col items-center text-center">
            <img
              src={`/heading-${context.locale}.png`}
              srcSet={`/heading-${context.locale}@2x.png 2x`}
              alt="lume"
              className="w-2/3"
            />
            <p className="mt-5 whitespace-pre-line text-lg font-medium leading-snug text-neutral-700">
              {t("welcome.title")}
            </p>
          </div>
          <div className="mx-auto flex w-full max-w-sm flex-col gap-2">
            <Link
              to="/auth/create"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-blue-500 text-lg font-medium text-white hover:bg-blue-600"
            >
              {t("welcome.signup")}
            </Link>
            <Link
              to="/auth/import"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-neutral-950 text-lg font-medium text-white hover:bg-neutral-900"
            >
              {t("welcome.login")}
            </Link>
          </div>
        </div>
        <div className="flex h-11 items-center justify-center">
          <p className="text-neutral-800">
            {t("welcome.footer")}{" "}
            <Link
              to="https://nostr.com"
              target="_blank"
              className="text-blue-500"
            >
              here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
