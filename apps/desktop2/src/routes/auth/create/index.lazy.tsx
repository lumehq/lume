import { LoaderIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createLazyFileRoute("/auth/create/")({
  component: Screen,
});

function Screen() {
  const navigate = useNavigate();

  const [t] = useTranslation();
  const [method, setMethod] = useState<"self" | "managed">("self");
  const [loading, setLoading] = useState(false);

  const next = () => {
    setLoading(true);

    if (method === "self") {
      navigate({ to: "/auth/create/self" });
    } else {
      navigate({ to: "/auth/create/managed" });
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold">{t("signup.title")}</h1>
          <p className="text-lg leading-snug text-neutral-600 dark:text-neutral-500">
            {t("signup.subtitle")}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setMethod("self")}
            className={cn(
              "flex flex-col items-start rounded-xl bg-neutral-100 px-4 py-3.5 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800",
              method === "self"
                ? "ring-1 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-black"
                : "",
            )}
          >
            <p className="font-semibold">{t("signup.selfManageMethod")}</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-500">
              {t("signup.selfManageMethodDescription")}
            </p>
          </button>
          <button
            type="button"
            onClick={() => setMethod("managed")}
            className={cn(
              "flex flex-col items-start rounded-xl bg-neutral-100 px-4 py-3.5 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800",
              method === "managed"
                ? "ring-1 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-black"
                : "",
            )}
          >
            <p className="font-semibold">{t("signup.providerMethod")}</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-500">
              {t("signup.providerMethodDescription")}
            </p>
          </button>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={next}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-500 text-lg font-medium text-white hover:bg-blue-600"
            >
              {loading ? (
                <LoaderIcon className="size-5 animate-spin" />
              ) : (
                t("global.continue")
              )}
            </button>
            {method === "managed" ? (
              <div className="flex flex-col gap-1.5 rounded-xl border border-red-200 bg-red-100 p-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-900 dark:text-red-200">
                <p className="font-semibold text-red-900 dark:text-red-100">
                  Attention:
                </p>
                <p>
                  You're chosing Managed by Provider, this feature still in
                  "Beta".
                </p>
                <p>
                  Some functions still missing or not work as expected, you
                  shouldn't create your main account with this method
                </p>
                <a
                  href="https://github.com/kind-0/nsecbunkerd/blob/master/OAUTH-LIKE-FLOW.md"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500"
                >
                  Learn more
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
