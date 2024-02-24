import { cn } from "@lume/utils";
import {
  Outlet,
  Link,
  createFileRoute,
  useParams,
} from "@tanstack/react-router";

export const Route = createFileRoute("/$account/home")({
  component: Home,
});

function Home() {
  // @ts-ignore, useless
  const { account } = useParams({ strict: false });

  return (
    <div className="h-full w-full overflow-hidden overflow-y-auto rounded-xl bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:bg-black dark:shadow-none dark:ring-1 dark:ring-white/5">
      <div className="mx-auto flex w-full max-w-xl flex-col">
        <div className="mx-auto flex h-28 w-1/2 items-center">
          <div className="flex h-11 w-full flex-1 items-center rounded-full bg-neutral-100 dark:bg-neutral-900">
            <Link
              to="/$account/home/local"
              params={{ account }}
              className="h-11 flex-1 p-1"
            >
              {({ isActive }) => (
                <div
                  className={cn(
                    "inline-flex h-full w-full items-center justify-center rounded-full text-sm font-medium",
                    isActive
                      ? "bg-white shadow shadow-neutral-500/20 dark:bg-black dark:shadow-none dark:ring-1 dark:ring-neutral-800"
                      : "",
                  )}
                >
                  Local
                </div>
              )}
            </Link>
            <Link
              to="/$account/home/global"
              params={{ account }}
              className="h-11 flex-1 p-1"
            >
              {({ isActive }) => (
                <div
                  className={cn(
                    "inline-flex h-full w-full items-center justify-center rounded-full text-sm font-medium",
                    isActive
                      ? "bg-white shadow shadow-neutral-500/20 dark:bg-black dark:shadow-none dark:ring-1 dark:ring-neutral-800"
                      : "",
                  )}
                >
                  Global
                </div>
              )}
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
