import {
  BellFilledIcon,
  BellIcon,
  HomeFilledIcon,
  HomeIcon,
  SpaceFilledIcon,
  SpaceIcon,
} from "@lume/icons";
import { useStorage } from "@lume/storage";
import { Link } from "@tanstack/react-router";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { cn } from "@lume/utils";
import { ActiveAccount } from "@lume/ui";

export const Route = createFileRoute("/app")({
  component: App,
});

function App() {
  const storage = useStorage();

  return (
    <div className="flex h-screen w-screen flex-col bg-gradient-to-tr from-neutral-200 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <div
        data-tauri-drag-region
        className={cn(
          "flex h-11 shrink-0 items-center justify-between",
          storage.platform === "macos" ? "pl-24" : "",
        )}
      >
        <div
          data-tauri-drag-region
          className="flex h-full flex-1 items-center gap-2"
        >
          <Link to="/app/home">
            {({ isActive }) => (
              <div
                className={cn(
                  "inline-flex h-9 w-max items-center justify-center gap-2 rounded-lg px-3 hover:bg-black/10 dark:hover:bg-white/10",
                  isActive ? "bg-white shadow dark:bg-neutral-950" : "",
                )}
              >
                {isActive ? (
                  <HomeFilledIcon className="size-5" />
                ) : (
                  <HomeIcon className="size-5" />
                )}
                <span className="text-sm font-medium">Home</span>
              </div>
            )}
          </Link>
          <Link to="/app/space">
            {({ isActive }) => (
              <div
                className={cn(
                  "inline-flex h-9 w-max items-center justify-center gap-2 rounded-lg px-3 hover:bg-black/10 dark:hover:bg-white/10",
                  isActive ? "bg-white shadow dark:bg-neutral-950" : "",
                )}
              >
                {isActive ? (
                  <SpaceFilledIcon className="size-5" />
                ) : (
                  <SpaceIcon className="size-5" />
                )}
                <span className="text-sm font-medium">Space</span>
              </div>
            )}
          </Link>
          <Link to="/app/activity">
            {({ isActive }) => (
              <div
                className={cn(
                  "inline-flex h-9 w-max items-center justify-center gap-2 rounded-lg px-3 hover:bg-black/10 dark:hover:bg-white/10",
                  isActive ? "bg-white shadow dark:bg-neutral-950" : "",
                )}
              >
                {isActive ? (
                  <BellFilledIcon className="size-5" />
                ) : (
                  <BellIcon className="size-5" />
                )}
                <span className="text-sm font-medium">Activity</span>
              </div>
            )}
          </Link>
        </div>
        <div data-tauri-drag-region className="flex items-center gap-2 pr-4">
          <ActiveAccount />
        </div>
      </div>
      <div className="flex h-full min-h-0 w-full">
        <div className="h-full w-full flex-1 px-2 pb-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
