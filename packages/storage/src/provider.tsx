import { LumeColumn } from "@lume/types";
import { locale, platform } from "@tauri-apps/plugin-os";
import { Store } from "@tauri-apps/plugin-store";
import {
	MutableRefObject,
	PropsWithChildren,
	useCallback,
	useRef,
	useState,
} from "react";
import { createContext, useContextSelector } from "use-context-selector";
import { type VListHandle } from "virtua";
import { LumeStorage } from "./storage";

const platformName = await platform();
const osLocale = (await locale()).slice(0, 2);

const store = new Store("lume.dat");
const storage = new LumeStorage(store, platformName, osLocale);
await storage.init();

type StorageContext = {
	storage: LumeStorage;
	column: {
		columns: LumeColumn[];
		vlistRef: MutableRefObject<VListHandle>;
		create: (column: LumeColumn) => void;
		remove: (id: number) => void;
		move: (id: number, position: "left" | "right") => void;
		update: (id: number, title: string, content: string) => void;
	};
};

const StorageContext = createContext<StorageContext>(null);

export const StorageProvider = ({ children }: PropsWithChildren<object>) => {
	const vlistRef = useRef<VListHandle>(null);

	const [columns, setColumns] = useState<LumeColumn[]>([
		{
			id: 1,
			title: "Newsfeed",
			content: "",
		},
		{
			id: 2,
			title: "For You",
			content: "",
		},
	]);

	const create = useCallback((column: LumeColumn) => {
		setColumns((prev) => [...prev, column]);
		vlistRef?.current.scrollToIndex(columns.length);
	}, []);

	const remove = useCallback((id: number) => {
		setColumns((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const update = useCallback(
		(id: number, title: string, content: string) => {
			const newCols = columns.map((col) => {
				if (col.id === id) {
					return { ...col, title, content };
				}
				return col;
			});

			setColumns(newCols);
		},
		[columns],
	);

	const move = useCallback(
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

	return (
		<StorageContext.Provider
			value={{
				storage,
				column: { columns, vlistRef, create, remove, move, update },
			}}
		>
			{children}
		</StorageContext.Provider>
	);
};

export const useStorage = () => {
	const context = useContextSelector(StorageContext, (state) => state.storage);
	if (context === undefined) {
		throw new Error("Storage Provider is required");
	}
	return context;
};

export const useColumn = () => {
	const context = useContextSelector(StorageContext, (state) => state.column);
	if (context === undefined) {
		throw new Error("Storage Provider is required");
	}
	return context;
};
