import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { type } from "@tauri-apps/plugin-os";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routes.gen"; // auto generated file
import "./app.css";
import {
	type PersistedQuery,
	experimental_createPersister,
} from "@tanstack/query-persist-client-core";
import { createStore } from "idb-keyval";
import { newIdbStorage } from "./commons";
import type { LumeEvent } from "./system";

const platform = type();
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 30,
			persister: experimental_createPersister<PersistedQuery>({
				storage: newIdbStorage(createStore("nostr", "storage")),
				maxAge: 1000 * 60 * 60 * 24, // 24 hours,
				serialize: (persistedQuery) => persistedQuery,
				deserialize: (cached) => cached,
			}),
		},
	},
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

// Register things for typesafety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
	interface HistoryState {
		events?: LumeEvent[];
	}
}

function App() {
	return <RouterProvider router={router} />;
}

// biome-ignore lint/style/noNonNullAssertion: idk
const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
}
