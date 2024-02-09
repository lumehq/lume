import { ArkProvider } from "@lume/ark";
import { StorageProvider } from "@lume/storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "sonner";
import i18n from "./i18n";
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
		<I18nextProvider i18n={i18n} defaultNS={"translation"}>
			<QueryClientProvider client={queryClient}>
				<Toaster position="top-center" theme="system" closeButton />
				<ArkProvider>
					<StorageProvider>
						<Router />
					</StorageProvider>
				</ArkProvider>
			</QueryClientProvider>
		</I18nextProvider>
	);
}
