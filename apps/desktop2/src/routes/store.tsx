import { GlobalIcon, LaurelIcon } from "@lume/icons";
import { ColumnRouteSearch } from "@lume/types";
import { cn } from "@lume/utils";
import { Link } from "@tanstack/react-router";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/store")({
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
  return (
    <div className="flex flex-col h-full">
      <div className="h-11 shrink-0 inline-flex w-full items-center gap-1 px-3">
        <Link to="/store/official">
          {({ isActive }) => (
            <div
              className={cn(
                "inline-flex h-7 w-max items-center justify-center gap-2 rounded-full px-3 text-sm font-medium",
                isActive ? "bg-neutral-50 dark:bg-white/10" : "opacity-50",
              )}
            >
              <LaurelIcon className="size-4" />
              Official
            </div>
          )}
        </Link>
        <Link to="/store/community">
          {({ isActive }) => (
            <div
              className={cn(
                "inline-flex h-7 w-max items-center justify-center gap-2 rounded-full px-3 text-sm font-medium",
                isActive ? "bg-neutral-50 dark:bg-white/10" : "opacity-50",
              )}
            >
              <GlobalIcon className="size-4" />
              Community
            </div>
          )}
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto w-full h-full scrollbar-none">
        <Outlet />
      </div>
    </div>
  );
}
