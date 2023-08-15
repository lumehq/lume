import Database from '@tauri-apps/plugin-sql';

import { Account } from '@utils/types';

let db: null | Database = null;

async function connect(): Promise<Database> {
  if (db) {
    return db;
  }
  try {
    db = await Database.load('sqlite:lume.db');
  } catch (e) {
    throw new Error('Failed to connect to database, error: ', e);
  }
  return db;
}

export async function checkActiveAccount() {
  const tempDB = await connect();
  const result: Array<Account> = await db.select(
    'SELECT * FROM accounts WHERE is_active = 1;'
  );

  // close temp db
  tempDB.close();

  if (result.length > 0) {
    return true;
  } else {
    return false;
  }
}
