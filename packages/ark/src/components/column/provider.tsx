import { IColumn } from "@lume/types";
import { COL_TYPES } from "@lume/utils";
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
	addColumn: (column: IColumn) => Promise<void>;
	removeColumn: (id: number) => Promise<void>;
	moveColumn: (id: number, position: "left" | "right") => void;
	loadAllColumns: () => Promise<IColumn[]>;
};

const ColumnContext = createContext<ColumnContext>(null);

export function ColumnProvider({ children }: { children: ReactNode }) {
	const storage = useStorage();
	const [columns, setColumns] = useState<IColumn[]>([
		{
			id: 9999,
			title: "Newsfeed",
			content: "",
			kind: COL_TYPES.newsfeed,
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

	const removeColumn = useCallback(async (id: number) => {
		await storage.removeWidget(id);
		setColumns((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const moveColumn = useCallback(
		(id: number, position: "left" | "right") => {
			const newCols = [...columns];

			const col = newCols.find((el) => el.id === id);
			const colIndex = newCols.findIndex((el) => el.id === id);

			newCols.splice(colIndex, 1);

			if (position === "left") newCols.splice(colIndex - 1, 0, col);
			if (position === "right") newCols.splice(colIndex + 1, 0, col);

			setColumns(newCols);
		},
		[columns],
	);

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
			value={{ columns, addColumn, removeColumn, moveColumn, loadAllColumns }}
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