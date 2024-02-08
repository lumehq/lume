import { locale, platform } from "@tauri-apps/plugin-os";
import { Store } from "@tauri-apps/plugin-store";
import { PropsWithChildren, createContext, useContext } from "react";
import { LumeStorage } from "./storage";

const StorageContext = createContext<LumeStorage>(null);

const store = new Store("lume.data");
const platformName = await platform();
const osLocale = await locale();

const db = new LumeStorage(store, platformName, osLocale);

export const StorageProvider = ({ children }: PropsWithChildren<object>) => {
	return (
		<StorageContext.Provider value={db}>{children}</StorageContext.Provider>
	);
};

export const useStorage = () => {
	const context = useContext(StorageContext);
	if (context === undefined) {
		throw new Error("Please import Storage Provider to use useStorage() hook");
	}
	return context;
};
