import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import "./app.css";
import i18n from "./locale";
import { routeTree } from "./router.gen"; // auto generated file
import { type } from "@tauri-apps/plugin-os";
import {
	experimental_createPersister,
	type AsyncStorage,
	type PersistedQuery,
} from "@tanstack/query-persist-client-core";
import { get, set, del, createStore, type UseStore } from "idb-keyval";

function newIdbStorage(idbStore: UseStore): AsyncStorage<PersistedQuery> {
	return {
		getItem: async (key) => await get(key, idbStore),
		setItem: async (key, value) => await set(key, value, idbStore),
		removeItem: async (key) => await del(key, idbStore),
	};
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 30, // 30 seconds
			// @ts-ignore, idk
			persister: experimental_createPersister<PersistedQuery>({
				storage: newIdbStorage(createStore("lume", "cache")),
				maxAge: 1000 * 60 * 60 * 12, // 12 hours,
				serialize: (persistedQuery) => persistedQuery,
				deserialize: (cached) => cached,
			}),
		},
	},
});

const os = await type();

// Set up a Router instance
const router = createRouter({
	routeTree,
	context: {
		queryClient,
		platform: os,
	},
	Wrap: ({ children }) => {
		return (
			<I18nextProvider i18n={i18n} defaultNS={"translation"}>
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			</I18nextProvider>
		);
	},
});

// Register things for typesafety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
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
