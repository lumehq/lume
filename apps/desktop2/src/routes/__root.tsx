import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { type Ark } from "@lume/ark";
import { type QueryClient } from "@tanstack/react-query";
import { type Platform } from "@tauri-apps/plugin-os";
import type { Account, Interests, Settings } from "@lume/types";
import { Spinner } from "@lume/ui";
import { type Descendant } from "slate";

type EditorElement = {
  type: string;
  children: Descendant[];
  eventId?: string;
};

interface RouterContext {
  ark: Ark;
  queryClient: QueryClient;
  platform?: Platform;
  locale?: string;
  settings?: Settings;
  interests?: Interests;
  accounts?: Account[];
  initialValue?: EditorElement[];
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
