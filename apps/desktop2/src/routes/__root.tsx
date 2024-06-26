import { Spinner } from "@lume/ui";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { OsType } from "@tauri-apps/plugin-os";

interface RouterContext {
	queryClient: QueryClient;
	platform: OsType;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: () => <Outlet />,
	pendingComponent: Pending,
	wrapInSuspense: true,
});

function Pending() {
	return (
		<div className="flex flex-col items-center justify-center w-screen h-screen">
			<Spinner className="size-5" />
		</div>
	);
}
