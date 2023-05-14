// `usePageContext` allows us to access `pageContext` in any React component.
// See https://vite-plugin-ssr.com/pageContext-anywhere
import type { PageContext } from "@renderer/types";

import { createContext, useContext } from "react";

const Context = createContext<PageContext>(undefined as any);

export function PageContextProvider({
	pageContext,
	children,
}: {
	pageContext: PageContext;
	children: React.ReactNode;
}) {
	return <Context.Provider value={pageContext}>{children}</Context.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePageContext() {
	const pageContext = useContext(Context);
	return pageContext;
}
