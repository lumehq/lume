import {
  BellFilledIcon,
  BellIcon,
  EditIcon,
  HomeFilledIcon,
  HomeIcon,
  SpaceFilledIcon,
  SpaceIcon,
} from "@lume/icons";
import { Link, useParams } from "@tanstack/react-router";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { cn } from "@lume/utils";
import { Accounts } from "@/components/accounts";
import { useArk } from "@lume/ark";

export const Route = createFileRoute("/$account")({
  component: App,
});

function App() {
  const ark = useArk();
  const context = Route.useRouteContext();

  return (
    <div className="flex h-screen w-screen flex-col bg-gradient-to-tr from-neutral-200 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <div
        data-tauri-drag-region
        className={cn(
          "flex h-11 shrink-0 items-center justify-between pr-4",
          context.platform === "macos" ? "pl-24" : "pl-4",
        )}
      >
        <Navigation />
        <div className="flex items-center gap-3">
          <Accounts />
          <button
            type="button"
            onClick={() => ark.open_editor()}
            className="inline-flex h-7 w-max items-center justify-center gap-1 rounded-full bg-blue-500 px-2.5 text-sm font-medium text-white hover:bg-blue-600"
          >
            <EditIcon className="size-4" />
            New
          </button>
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

function Navigation() {
  // @ts-ignore, useless
  const { account } = useParams({ strict: false });

  return (
    <div
      data-tauri-drag-region
      className="flex h-full flex-1 items-center gap-2"
    >
      <Link to="/$account/home/local" params={{ account }}>
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
      <Link to="/$account/space" params={{ account }}>
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
      <Link to="/$account/activity" params={{ account }}>
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
  );
}
