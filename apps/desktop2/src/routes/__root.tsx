import type { Ark } from "@lume/ark";
import type { Account, Interests, Metadata, Settings } from "@lume/types";
import { Spinner } from "@lume/ui";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { Platform } from "@tauri-apps/plugin-os";
import type { Descendant } from "slate";

type EditorElement = {
	type: string;
	children: Descendant[];
	eventId?: string;
};

interface RouterContext {
	// System
	ark: Ark;
	queryClient: QueryClient;
	// App info
	platform?: Platform;
	locale?: string;
	// Settings
	settings?: Settings;
	interests?: Interests;
	// Profile
	accounts?: Account[];
	profile?: Metadata;
	// Editor
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
			<Spinner className="size-5" />
		</div>
	);
}
