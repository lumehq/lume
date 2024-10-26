import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { type } from "@tauri-apps/plugin-os";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import type { LumeEvent } from "./system";

import { routeTree } from "./routes.gen"; // auto generated file
import "./app.css"; // global styles

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
	interface HistoryState {
		events?: LumeEvent[];
	}
}

const platform = type();
const queryClient = new QueryClient();
const router = createRouter({
	routeTree,
	context: { queryClient, platform },
	Wrap: ({ children }) => {
		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
	},
});

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement as unknown as HTMLElement);

root.render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
