import { useStorage } from "@lume/storage";
import { IColumn } from "@lume/types";
import { COL_TYPES } from "@lume/utils";
import {
	type MutableRefObject,
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";
import { type VListHandle } from "virtua";

type ColumnContext = {
	columns: IColumn[];
	vlistRef: MutableRefObject<VListHandle>;
	addColumn: (column: IColumn) => Promise<void>;
	removeColumn: (id: number) => Promise<void>;
	moveColumn: (id: number, position: "left" | "right") => void;
	updateColumn: (id: number, title: string, content: string) => Promise<void>;
	loadAllColumns: () => Promise<IColumn[]>;
};

const ColumnContext = createContext<ColumnContext>(null);

export function ColumnProvider({ children }: { children: ReactNode }) {
	const storage = useStorage();
	const vlistRef = useRef<VListHandle>(null);

	const [columns, setColumns] = useState<IColumn[]>([
		{
			id: 9999,
			title: "Newsfeed",
			content: "",
			kind: COL_TYPES.newsfeed,
		},
		{
			id: 9998,
			title: "For You",
			content: "",
			kind: COL_TYPES.foryou,
		},
	]);

	const loadAllColumns = useCallback(async () => {
		return await storage.getColumns();
	}, []);

	const addColumn = useCallback(async (column: IColumn) => {
		const result = await storage.createColumn(
			column.kind,
			column.title,
			column.content,
		);
		if (result) {
			setColumns((prev) => [...prev, result]);
			vlistRef?.current.scrollToIndex(columns.length);
		}
	}, []);

	const removeColumn = useCallback(async (id: number) => {
		if (id === 9998 || id === 9999) {
			toast.info("You cannot remove default column");
			return;
		}

		await storage.removeColumn(id);
		setColumns((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const updateColumn = useCallback(
		async (id: number, title: string, content: string) => {
			const res = await storage.updateColumn(id, title, content);
			if (res) {
				const newCols = columns.map((col) => {
					if (col.id === id) {
						return { ...col, title, content };
					}
					return col;
				});

				setColumns(newCols);
			}
		},
		[columns],
	);

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
			value={{
				columns,
				vlistRef,
				addColumn,
				removeColumn,
				moveColumn,
				updateColumn,
				loadAllColumns,
			}}
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
