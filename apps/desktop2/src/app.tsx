import { StorageProvider } from "@lume/storage";
import { useArk } from "@lume/ark";
import { ArkProvider } from "./ark";
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

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: {
    ark: undefined!,
    queryClient,
  },
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const ark = useArk();
  return <RouterProvider router={router} context={{ ark }} />;
}

function App() {
  return (
    <ArkProvider>
      <InnerApp />
    </ArkProvider>
  );
}

// biome-ignore lint/style/noNonNullAssertion: idk
const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <I18nextProvider i18n={i18n} defaultNS={"translation"}>
      <QueryClientProvider client={queryClient}>
        <StorageProvider>
          <StrictMode>
            <App />
          </StrictMode>
        </StorageProvider>
      </QueryClientProvider>
    </I18nextProvider>,
  );
}
