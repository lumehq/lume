/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react';
import Database from 'tauri-plugin-sql-api';

export const DatabaseContext = createContext({});

const db = typeof window !== 'undefined' ? await Database.load('sqlite:lume.db') : null;

export default function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const value = db;

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
}
