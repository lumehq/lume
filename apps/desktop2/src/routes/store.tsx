import { GlobalIcon, LaurelIcon } from "@lume/icons";
import { ColumnRouteSearch } from "@lume/types";
import { Column } from "@lume/ui";
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
  const { label, name } = Route.useSearch();

  return (
    <Column.Root>
      <Column.Header label={label} name={name}>
        <div className="inline-flex h-full w-full items-center gap-1">
          <Link to="/store/official">
            {({ isActive }) => (
              <div
                className={cn(
                  "inline-flex h-7 w-max items-center justify-center gap-2 rounded-full px-3 text-sm font-medium",
                  isActive
                    ? "bg-neutral-100 dark:bg-neutral-900"
                    : "opacity-50",
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
                  isActive
                    ? "bg-neutral-100 dark:bg-neutral-900"
                    : "opacity-50",
                )}
              >
                <GlobalIcon className="size-4" />
                Community
              </div>
            )}
          </Link>
        </div>
      </Column.Header>
      <Column.Content>
        <Outlet />
      </Column.Content>
    </Column.Root>
  );
}
