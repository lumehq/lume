import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { type } from "@tauri-apps/plugin-os";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routes.gen"; // auto generated file
import type { LumeEvent } from "./system";
import "./app.css";

const platform = type();
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 30,
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
