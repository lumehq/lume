import {
  BellFilledIcon,
  BellIcon,
  ComposeFilledIcon,
  HomeFilledIcon,
  HomeIcon,
  HorizontalDotsIcon,
  SpaceFilledIcon,
  SpaceIcon,
} from "@lume/icons";
import { Link } from "@tanstack/react-router";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { cn } from "@lume/utils";
import { Accounts } from "@/components/accounts";
import { useArk } from "@lume/ark";
import { Box } from "@lume/ui";

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
            className="inline-flex h-8 w-max items-center justify-center gap-1 rounded-full bg-blue-500 px-3 text-sm font-medium text-white hover:bg-blue-600"
          >
            <ComposeFilledIcon className="size-4" />
            New post
          </button>
        </div>
      </div>
      <Box>
        <Outlet />
      </Box>
    </div>
  );
}

function Navigation() {
  // @ts-ignore, useless
  const { account } = Route.useParams();

  return (
    <div
      data-tauri-drag-region
      className="flex h-full flex-1 items-center gap-2"
    >
      <Link to="/$account/home" params={{ account }}>
        {({ isActive }) => (
          <div
            className={cn(
              "inline-flex h-8 w-max items-center justify-center gap-2 rounded-full px-3",
              isActive
                ? "bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                : "hover:bg-black/10 dark:hover:bg-white/10",
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
              "inline-flex h-8 w-max items-center justify-center gap-2 rounded-full px-3 hover:bg-black/10 dark:hover:bg-white/10",
              isActive
                ? "bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                : "hover:bg-black/10 dark:hover:bg-white/10",
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
              "inline-flex h-8 w-max items-center justify-center gap-2 rounded-full px-3 hover:bg-black/10 dark:hover:bg-white/10",
              isActive
                ? "bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                : "hover:bg-black/10 dark:hover:bg-white/10",
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
