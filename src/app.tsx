import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { type } from "@tauri-apps/plugin-os";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routes.gen"; // auto generated file
import type { LumeEvent } from "./system";
import "./app.css";
import { experimental_createPersister } from "@tanstack/query-persist-client-core";
import { Store } from "@tauri-apps/plugin-store";
import { newQueryStorage } from "./commons";

const platform = type();
const store = new Store(".cache");
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 30,
			persister: experimental_createPersister({
				storage: newQueryStorage(store),
				maxAge: 1000 * 60 * 60 * 12, // 12 hours
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
