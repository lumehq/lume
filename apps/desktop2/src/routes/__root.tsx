import { LoaderIcon } from "@lume/icons";
import {
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { type Ark } from "@lume/ark";
import { type QueryClient } from "@tanstack/react-query";
import { type Platform } from "@tauri-apps/plugin-os";

interface RouterContext {
  ark: Ark;
  queryClient: QueryClient;
  platform: Platform;
  locale: string;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  ),
  pendingComponent: Pending,
  wrapInSuspense: true,
});

function Pending() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <LoaderIcon className="size-5 animate-spin" />
    </div>
  );
}
