import { ArticleIcon, GroupFeedsIcon } from "@lume/icons";
import { NostrQuery } from "@lume/system";
import type { ColumnRouteSearch } from "@lume/types";
import { cn } from "@lume/utils";
import { Link, Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trending")({
  validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
    return {
      account: search.account,
      label: search.label,
      name: search.name,
    };
  },
  beforeLoad: async () => {
    const settings = await NostrQuery.getSettings();
    return { settings };
  },
  component: Screen,
});

function Screen() {
  return (
    <div className="flex flex-col h-full">
      <div className="h-11 shrink-0 inline-flex w-full items-center gap-1 px-3">
        <div className="inline-flex h-full w-full items-center gap-1">
          <Link to="/trending/notes">
            {({ isActive }) => (
              <div
                className={cn(
                  "inline-flex h-7 w-max items-center justify-center gap-2 rounded-full px-3 text-sm font-medium",
                  isActive ? "bg-neutral-50 dark:bg-white/10" : "opacity-50",
                )}
              >
                <ArticleIcon className="size-4" />
                Notes
              </div>
            )}
          </Link>
          <Link to="/trending/users">
            {({ isActive }) => (
              <div
                className={cn(
                  "inline-flex h-7 w-max items-center justify-center gap-2 rounded-full px-3 text-sm font-medium",
                  isActive ? "bg-neutral-50 dark:bg-white/10" : "opacity-50",
                )}
              >
                <GroupFeedsIcon className="size-4" />
                Users
              </div>
            )}
          </Link>
        </div>
      </div>
      <div className="p-2 flex-1 overflow-y-auto w-full h-full scrollbar-none">
        <Outlet />
      </div>
    </div>
  );
}
