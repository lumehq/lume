import { broadcastQueryClient } from "@tanstack/query-broadcast-client-experimental";
import { experimental_createPersister } from "@tanstack/query-persist-client-core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { type } from "@tauri-apps/plugin-os";
import { Store } from "@tauri-apps/plugin-store";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { newQueryStorage } from "./commons";
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
// @ts-ignore, won't fix
const store = await Store.load(".data", { autoSave: 300 });
const storage = newQueryStorage(store);
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 20, // 20 seconds
			persister: experimental_createPersister({
				storage: storage,
				maxAge: 1000 * 60 * 60 * 6, // 6 hours
			}),
		},
	},
});

// Make sure all webviews use same query client
broadcastQueryClient({
	queryClient,
	broadcastChannel: "lume",
});

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
