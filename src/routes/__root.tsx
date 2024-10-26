import { Spinner } from "@/components";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { OsType } from "@tauri-apps/plugin-os";

interface RouterContext {
	queryClient: QueryClient;
	platform: OsType;
	accounts?: string[];
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: Screen,
	pendingComponent: Pending,
});

function Screen() {
	return <Outlet />;
}

function Pending() {
	return (
		<div className="flex flex-col items-center justify-center w-screen h-screen">
			<Spinner className="size-5" />
		</div>
	);
}
