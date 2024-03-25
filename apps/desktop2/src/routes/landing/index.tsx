import { KeyIcon, RemoteIcon } from "@lume/icons";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/landing/")({
  component: Screen,
});

function Screen() {
  const { t } = useTranslation();
  const context = Route.useRouteContext();

  return (
    <div className="relative flex h-screen w-screen bg-black">
      <div
        data-tauri-drag-region
        className="absolute left-0 top-0 z-50 h-16 w-full"
      />
      <div className="z-20 flex h-full w-full flex-col items-center justify-between">
        <div />
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10">
          <div className="flex flex-col items-center text-center">
            <img
              src={`/heading-${context.locale}.png`}
              srcSet={`/heading-${context.locale}@2x.png 2x`}
              alt="lume"
              className="w-3/4 xl:w-2/3"
            />
            <p className="mt-4 whitespace-pre-line text-lg font-medium leading-snug text-white/70">
              {t("welcome.title")}
            </p>
          </div>
          <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
            <Link
              to="/auth/create"
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-white font-medium text-blue-500 backdrop-blur-lg hover:bg-white/90"
            >
              {t("welcome.signup")}
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-white/20" />
              <span className="text-white">Or</span>
              <div className="h-px flex-1 bg-white/20" />
            </div>
            <div className="flex flex-col gap-2">
              <Link
                to="/auth/remote"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white/20 px-3 font-medium text-white backdrop-blur-md hover:bg-white/40"
              >
                <RemoteIcon className="size-5" />
                Continue with Remote Signing
              </Link>
              <Link
                to="/auth/privkey"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white/20 px-3 font-medium text-white backdrop-blur-md hover:bg-white/40"
              >
                <KeyIcon className="size-5" />
                Continue with Private Key
              </Link>
            </div>
          </div>
        </div>
        <div className="flex h-11 items-center justify-center"></div>
      </div>
      <div className="absolute z-10 h-full w-full bg-white/5 backdrop-blur-sm dark:bg-black/5" />
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
          className="absolute bottom-3 right-3 z-50 rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-md dark:bg-black/20"
        >
          Design by NoGood
        </a>
      </div>
    </div>
  );
}
