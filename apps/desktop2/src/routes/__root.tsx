import { CheckCircleIcon, InfoCircleIcon, CancelCircleIcon } from "@lume/icons";
import type { Interests, Metadata, Settings } from "@lume/types";
import { Spinner } from "@lume/ui";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { Platform } from "@tauri-apps/plugin-os";
import type { Descendant } from "slate";
import { Toaster } from "sonner";

type EditorElement = {
	type: string;
	children: Descendant[];
	eventId?: string;
};

interface RouterContext {
	// System
	queryClient: QueryClient;
	// App info
	platform?: Platform;
	locale?: string;
	// Settings
	settings?: Settings;
	interests?: Interests;
	// Profile
	accounts?: string[];
	profile?: Metadata;
	isNewUser?: boolean;
	// Editor
	initialValue?: EditorElement[];
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
		<div className="flex h-screen w-screen flex-col items-center justify-center">
			<Spinner className="size-5" />
		</div>
	);
}
