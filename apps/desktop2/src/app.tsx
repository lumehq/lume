import { Ark } from "@lume/ark";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { platform } from "@tauri-apps/plugin-os";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import "./app.css";
import i18n from "./locale";
import { routeTree } from "./router.gen"; // auto generated file

const ark = new Ark();
const queryClient = new QueryClient();
const platformName = await platform();

const persister = createSyncStoragePersister({
	storage: window.localStorage,
});

// Set up a Router instance
const router = createRouter({
	routeTree,
	context: {
		ark,
		queryClient,
		platform: platformName,
	},
	Wrap: ({ children }) => {
		return (
			<I18nextProvider i18n={i18n} defaultNS={"translation"}>
				<PersistQueryClientProvider
					client={queryClient}
					persistOptions={{ persister }}
				>
					{children}
				</PersistQueryClientProvider>
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
