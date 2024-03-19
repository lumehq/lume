import { Column } from "@lume/ui";
import { cn } from "@lume/utils";
import { Link } from "@tanstack/react-router";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/store")({
  component: Screen,
});

function Screen() {
  return (
    <Column.Root>
      <Column.Content>
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-neutral-100 px-3 dark:border-neutral-900">
          <Link to="/store/official">
            {({ isActive }) => (
              <div
                className={cn(
                  "inline-flex h-8 w-max items-center justify-center rounded-full px-6 text-sm",
                  isActive
                    ? "bg-neutral-100 font-medium dark:bg-neutral-900"
                    : "opacity-50",
                )}
              >
                Official
              </div>
            )}
          </Link>
          <Link to="/store/community">
            {({ isActive }) => (
              <div
                className={cn(
                  "inline-flex h-8 w-max items-center justify-center rounded-full px-6 text-sm",
                  isActive
                    ? "bg-neutral-100 font-medium dark:bg-neutral-900"
                    : "opacity-50",
                )}
              >
                Community
              </div>
            )}
          </Link>
        </div>
        <Outlet />
      </Column.Content>
    </Column.Root>
  );
}
