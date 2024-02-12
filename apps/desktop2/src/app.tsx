import { ArkProvider } from "@lume/ark";
import { StorageProvider } from "@lume/storage";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import "./app.css";
import i18n from "./i18n";

// Import the generated route tree
import { routeTree } from "./tree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render the app
// biome-ignore lint/style/noNonNullAssertion: <explanation>
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<I18nextProvider i18n={i18n} defaultNS={"translation"}>
			<StorageProvider>
				<ArkProvider>
					<StrictMode>
						<RouterProvider router={router} />
					</StrictMode>
				</ArkProvider>
			</StorageProvider>
		</I18nextProvider>,
	);
}
