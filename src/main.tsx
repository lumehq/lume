import App from "./app";
import { RelayProvider } from "@shared/relayProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			cacheTime: 1000 * 60 * 60 * 24,
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
