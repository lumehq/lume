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
});
