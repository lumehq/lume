import { useArk } from "@lume/ark";
import { ArkProvider } from "./ark";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import "./app.css";
import i18n from "./locale";
import { Toaster } from "sonner";
import { locale, platform } from "@tauri-apps/plugin-os";
import { routeTree } from "./router.gen"; // auto generated file
import { get, set, del } from "idb-keyval";
import {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

function createIDBPersister(idbValidKey: IDBValidKey = "reactQuery") {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client);
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey);
    },
    removeClient: async () => {
      await del(idbValidKey);
    },
  } as Persister;
}

const persister = createIDBPersister();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});
const platformName = await platform();
const osLocale = (await locale()).slice(0, 2);

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: {
    ark: undefined!,
    platform: platformName,
    locale: osLocale,
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
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <StrictMode>
          <Toaster position="top-center" richColors />
          <App />
        </StrictMode>
      </PersistQueryClientProvider>
    </I18nextProvider>,
  );
}
