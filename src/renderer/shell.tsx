import { LayoutDefault } from "./layoutDefault";
import { PageContext } from "./types";
import { RelayProvider } from "@shared/relayProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dateToUnix } from "@utils/date";
import { PageContextProvider } from "@utils/hooks/usePageContext";
import { updateLastLogin } from "@utils/storage";
import { useEffect } from "react";

const queryClient = new QueryClient();

export function Shell({
	children,
	pageContext,
}: { children: React.ReactNode; pageContext: PageContext }) {
	const Layout =
		(pageContext.exports.Layout as React.ElementType) ||
		(LayoutDefault as React.ElementType);

	useEffect(() => {
		async function initWindowEvent() {
			const { TauriEvent } = await import("@tauri-apps/api/event");
			const { appWindow, getCurrent } = await import("@tauri-apps/api/window");

			// listen window close event
			getCurrent().listen(TauriEvent.WINDOW_CLOSE_REQUESTED, () => {
				// update last login time
				updateLastLogin(dateToUnix());
				// close window
				appWindow.close();
			});
		}

		initWindowEvent().catch(console.error);
	}, []);

	return (
		<PageContextProvider pageContext={pageContext}>
			<RelayProvider>
				<Layout>
					<QueryClientProvider client={queryClient}>
						{children}
					</QueryClientProvider>
				</Layout>
			</RelayProvider>
		</PageContextProvider>
	);
}
