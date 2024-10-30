import { commands } from "@/commands.gen";
import { Spinner } from "@/components";
import type { Metadata, NostrEvent } from "@/types";
import { type QueryClient, queryOptions } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import type { OsType } from "@tauri-apps/plugin-os";
import type { Store } from "@tauri-apps/plugin-store";
import { useEffect } from "react";

interface RouterContext {
	store: Store;
	queryClient: QueryClient;
	platform: OsType;
	accounts?: string[];
}

export const settingsQueryOptions = queryOptions({
	queryKey: ["settings"],
	queryFn: async () => {
		const res = await commands.getAppSettings();

		if (res.status === "ok") {
			return res.data;
		} else {
			throw new Error(res.error);
		}
	},
});

export const Route = createRootRouteWithContext<RouterContext>()({
	component: Screen,
	pendingComponent: Pending,
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(settingsQueryOptions),
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
