import {
	type PersistedQuery,
	experimental_createPersister,
} from "@tanstack/query-persist-client-core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { type } from "@tauri-apps/plugin-os";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { newQueryStorage } from "./commons";
import { routeTree } from "./routes.gen"; // auto generated file
import type { LumeEvent } from "./system";
import "./app.css";
import { Store } from "@tauri-apps/plugin-store";

const platform = type();
const tauriStore = new Store(".lume.dat");
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 30,
			persister: experimental_createPersister<PersistedQuery>({
				storage: newQueryStorage(tauriStore),
				maxAge: 1000 * 60 * 60 * 24, // 24 hours,
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
