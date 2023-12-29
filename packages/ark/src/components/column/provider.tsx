import { IColumn } from "@lume/types";
import { WIDGET_KIND } from "@lume/utils";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import {
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useStorage } from "../../provider";

type ColumnContext = {
	columns: IColumn[];
	addColumn: (column: IColumn) => void;
	removeColumn: (id: string) => void;
	loadAllColumns: () => void;
};

const ColumnContext = createContext<ColumnContext>(null);

export function ColumnProvider({ children }: { children: ReactNode }) {
	const storage = useStorage();
	const [columns, setColumns] = useState<IColumn[]>([
		{
			id: "9999",
			title: "Newsfeed",
			content: "",
			kind: WIDGET_KIND.newsfeed,
		},
	]);

	const loadAllColumns = useCallback(async () => {
		return await storage.getWidgets();
	}, []);

	const addColumn = useCallback(async (column: IColumn) => {
		const result = await storage.createWidget(
			column.kind,
			column.title,
			column.content,
		);
		if (result) setColumns((prev) => [...prev, column]);
	}, []);

	const removeColumn = useCallback(async (id: string) => {
		await storage.removeWidget(id);
		setColumns((prev) => prev.filter((t) => t.id !== id));
	}, []);

	useEffect(() => {
		let isMounted = true;

		loadAllColumns().then((data) => {
			if (isMounted) setColumns((prev) => [...prev, ...data]);
		});

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<ColumnContext.Provider
			value={{ columns, addColumn, removeColumn, loadAllColumns }}
		>
			{children}
		</ColumnContext.Provider>
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
