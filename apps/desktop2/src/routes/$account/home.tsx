import { GlobalIcon, LocalIcon, RefreshIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$account/home")({
  component: Screen,
});

function Screen() {
  const queryClient = useQueryClient();
  const { account } = Route.useParams();

  const refresh = async () => {
    const queryKey = `${window.location.pathname.split("/").at(-1)}_newsfeed`;
    await queryClient.refetchQueries({ queryKey: [queryKey, account] });
  };

  return (
    <div className="flex flex-col">
      <div className="mx-auto mb-4 flex h-16 w-full max-w-xl shrink-0 items-center justify-between border-b border-neutral-100 dark:border-neutral-900">
        <div className="flex items-center gap-2">
          <Link to="/$account/home/local">
            {({ isActive }) => (
              <div
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm leading-tight hover:bg-neutral-100 dark:hover:bg-neutral-900",
                  isActive
                    ? "bg-neutral-100 font-semibold text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                    : "text-neutral-600 dark:text-neutral-400",
                )}
              >
                <LocalIcon className="size-4" />
                Local
              </div>
            )}
          </Link>
          <Link to="/$account/home/global">
            {({ isActive }) => (
              <div
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm leading-tight hover:bg-neutral-100 dark:hover:bg-neutral-900",
                  isActive
                    ? "bg-neutral-100 font-semibold text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                    : "text-neutral-600 dark:text-neutral-400",
                )}
              >
                <GlobalIcon className="size-4" />
                Global
              </div>
            )}
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={refresh}
            className="text-neutral-700 hover:text-blue-500 dark:text-neutral-300"
          >
            <RefreshIcon className="size-4" />
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
