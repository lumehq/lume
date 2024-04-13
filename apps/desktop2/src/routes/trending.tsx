import { ArticleIcon, GroupFeedsIcon } from "@lume/icons";
import { ColumnRouteSearch } from "@lume/types";
import { Column } from "@lume/ui";
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
  beforeLoad: async ({ context }) => {
    const ark = context.ark;
    const settings = await ark.get_settings();

    return { settings };
  },
  component: Screen,
});

export function Screen() {
  const { label, name } = Route.useSearch();

  return (
    <Column.Root>
      <Column.Header label={label} name={name}>
        <div className="inline-flex h-full w-full items-center gap-1">
          <Link to="/trending/notes">
            {({ isActive }) => (
              <div
                className={cn(
                  "inline-flex h-7 w-max items-center justify-center gap-2 rounded-full px-3 text-sm font-medium",
                  isActive
                    ? "bg-neutral-100 dark:bg-neutral-900"
                    : "opacity-50",
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
                  isActive
                    ? "bg-neutral-100 dark:bg-neutral-900"
                    : "opacity-50",
                )}
              >
                <GroupFeedsIcon className="size-4" />
                Users
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
