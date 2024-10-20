import { events } from "@/commands.gen";
import { appSettings } from "@/commons";
import { Spinner } from "@/components";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { listen } from "@tauri-apps/api/event";
import type { OsType } from "@tauri-apps/plugin-os";
import { useEffect } from "react";

interface RouterContext {
	queryClient: QueryClient;
	platform: OsType;
	account: string[];
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: Screen,
	pendingComponent: Pending,
});

function Screen() {
	const { queryClient } = Route.useRouteContext();

	useEffect(() => {
		const unlisten = events.newSettings.listen((data) => {
			appSettings.setState((state) => {
				return { ...state, ...data.payload };
			});
		});

		return () => {
			unlisten.then((f) => f());
		};
	}, []);

	useEffect(() => {
		const unlisten = listen("synchronized", async () => {
			await queryClient.invalidateQueries();
		});

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
