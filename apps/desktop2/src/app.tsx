import { ArkProvider } from "@lume/ark";
import { StorageProvider } from "@lume/storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import "./app.css";
import i18n from "./locale";

// Import the generated route tree
import { routeTree } from "./router.gen";

const queryClient = new QueryClient();
const router = createRouter({
	routeTree,
	context: {
		queryClient,
	},
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<I18nextProvider i18n={i18n} defaultNS={"translation"}>
			<QueryClientProvider client={queryClient}>
				<StorageProvider>
					<ArkProvider>
						<StrictMode>
							<RouterProvider router={router} />
						</StrictMode>
					</ArkProvider>
				</StorageProvider>
			</QueryClientProvider>
		</I18nextProvider>,
	);
}
