import { LumeColumn } from "@lume/types";
import { ReactNode, createContext, useContext } from "react";

const ColumnContext = createContext<LumeColumn>(null);

export function ColumnProvider({
	column,
	children,
}: { column: LumeColumn; children: ReactNode }) {
	return (
		<ColumnContext.Provider value={column}>{children}</ColumnContext.Provider>
	);
}

export function useColumnContext() {
	const context = useContext(ColumnContext);
	if (!context) {
		throw new Error(
			"Please import Column Provider to use useColumnContext() hook",
		);
	}
	return context;
}
