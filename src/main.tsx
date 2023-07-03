import App from "./app";
import { getSetting } from "@libs/storage";
import { RelayProvider } from "@shared/relayProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";

const cacheTime = await getSetting("cache_time");

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			cacheTime: parseInt(cacheTime),
		},
	},
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
	<QueryClientProvider client={queryClient}>
		<RelayProvider>
			<App />
		</RelayProvider>
	</QueryClientProvider>,
);
