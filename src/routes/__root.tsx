import { events } from "@/commands.gen";
import { Spinner } from "@/components";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
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
		const unlisten = events.negentropyEvent.listen(async (data) => {
			const queryKey = [data.payload.kind.toLowerCase()];
			console.info("invalidate: ", queryKey);

			await queryClient.refetchQueries({ queryKey });
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
