import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { type Ark } from "@lume/ark";
import { type QueryClient } from "@tanstack/react-query";
import { type Platform } from "@tauri-apps/plugin-os";
import { Account, Interests, Settings } from "@lume/types";
import { Spinner } from "@lume/ui";

interface RouterContext {
  ark: Ark;
  queryClient: QueryClient;
  platform?: Platform;
  locale?: string;
  settings?: Settings;
  interests?: Interests;
  accounts?: Account[];
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
  pendingComponent: Pending,
  wrapInSuspense: true,
});

function Pending() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <button type="button" className="size-5" disabled>
        <Spinner className="size-5" />
      </button>
    </div>
  );
}
