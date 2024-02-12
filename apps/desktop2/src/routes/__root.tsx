import { LoaderIcon } from "@lume/icons";
import {
	Outlet,
	ScrollRestoration,
	createRootRoute,
} from "@tanstack/react-router";

export const Route = createRootRoute({
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
		<div className="flex flex-col items-center justify-center w-screen h-screen">
			<LoaderIcon className="size-5 animate-spin" />
		</div>
	);
}
