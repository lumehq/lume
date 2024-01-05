import { LumeProvider } from "@lume/ark";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Router from "./router";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // 10 seconds
		},
	},
});

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Toaster position="top-center" theme="system" closeButton />
			<LumeProvider>
				<Router />
			</LumeProvider>
		</QueryClientProvider>
	);
}
