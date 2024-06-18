import { CancelCircleIcon, CheckCircleIcon, InfoCircleIcon } from "@lume/icons";
import type { Settings } from "@lume/system";
import { Spinner } from "@lume/ui";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { Platform } from "@tauri-apps/plugin-os";
import { Toaster } from "sonner";

interface RouterContext {
	// System
	queryClient: QueryClient;
	// App info
	platform?: Platform;
	locale?: string;
	// Settings
	settings?: Settings;
	// Accounts
	accounts?: string[];
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: () => (
		<>
			<Toaster
				position="bottom-right"
				icons={{
					success: <CheckCircleIcon className="size-5" />,
					info: <InfoCircleIcon className="size-5" />,
					error: <CancelCircleIcon className="size-5" />,
				}}
				closeButton
				theme="system"
			/>
			<Outlet />
		</>
	),
	pendingComponent: Pending,
	wrapInSuspense: true,
});

function Pending() {
	return (
		<div className="flex flex-col items-center justify-center size-screen">
			<Spinner className="size-5" />
		</div>
	);
}
