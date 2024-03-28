import { ComposeFilledIcon, PlusIcon } from "@lume/icons";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { cn } from "@lume/utils";
import { Accounts } from "@/components/accounts";
import { useArk } from "@lume/ark";

export const Route = createFileRoute("/$account")({
  component: App,
});

function App() {
  const ark = useArk();
  const navigate = useNavigate();
  const { platform } = Route.useRouteContext();

  return (
    <div className="flex h-screen w-screen flex-col">
      <div
        data-tauri-drag-region
        className={cn(
          "flex h-11 shrink-0 items-center justify-between pr-2",
          platform === "macos" ? "ml-2 pl-20" : "pl-4",
        )}
      >
        <div className="flex items-center gap-3">
          <Accounts />
          <button
            type="button"
            onClick={() => navigate({ to: "/landing" })}
            className="inline-flex size-8 items-center justify-center rounded-full bg-neutral-200 text-neutral-800 hover:bg-neutral-400 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-600"
          >
            <PlusIcon className="size-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => ark.open_editor()}
            className="inline-flex h-8 w-max items-center justify-center gap-1 rounded-full bg-blue-500 px-3 text-sm font-medium text-white hover:bg-blue-600"
          >
            <ComposeFilledIcon className="size-4" />
            New Post
          </button>
          <div id="toolbar" />
        </div>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
