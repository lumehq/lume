import { QueryClient } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import "./app.css";
import i18n from "./locale";
import { Toaster } from "sonner";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { routeTree } from "./router.gen"; // auto generated file
import { CancelCircleIcon, CheckCircleIcon, InfoCircleIcon } from "@lume/icons";
import { Ark } from "@lume/ark";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

const ark = new Ark();

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: {
    ark,
    queryClient,
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
    <I18nextProvider i18n={i18n} defaultNS={"translation"}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <StrictMode>
          <Toaster
            position="bottom-right"
            icons={{
              success: <CheckCircleIcon className="size-5" />,
              info: <InfoCircleIcon className="size-5" />,
              error: <CancelCircleIcon className="size-5" />,
            }}
            closeButton
            theme="system"
          />
          <App />
        </StrictMode>
      </PersistQueryClientProvider>
    </I18nextProvider>,
  );
}
