import { locale, platform } from "@tauri-apps/plugin-os";
import Database from "@tauri-apps/plugin-sql";
import { PropsWithChildren, createContext, useContext } from "react";
import { LumeStorage } from "./storage";

const StorageContext = createContext<LumeStorage>(null);

const sqliteAdapter = await Database.load("sqlite:lume_v3.db");
const platformName = await platform();
const osLocale = await locale();

const db = new LumeStorage(sqliteAdapter, platformName, osLocale);
await db.init();

if (db.settings.depot) await db.launchDepot();

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
