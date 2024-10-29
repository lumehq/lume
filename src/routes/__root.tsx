import { Spinner } from "@/components";
import type { Metadata, NostrEvent } from "@/types";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import type { OsType } from "@tauri-apps/plugin-os";
import { useEffect } from "react";

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
	const { queryClient } = Route.useRouteContext();

	useEffect(() => {
		const unlisten = getCurrentWindow().listen<string>(
			"metadata",
			async (data) => {
				const payload = data.payload;
				const event: NostrEvent = JSON.parse(payload);
				const metadata: Metadata = JSON.parse(event.content);

				queryClient.setQueryData(["profile", event.pubkey], () => metadata);
			},
		);

		return () => {
			unlisten.then((f) => f());
		};
	}, []);

	return <Outlet />;
}

function Pending() {
	return (
		<div className="flex flex-col items-center justify-center w-screen h-screen">
			<Spinner className="size-5" />
		</div>
	);
}
