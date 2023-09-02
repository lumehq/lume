import Database from 'tauri-plugin-sql-api';

import { Account } from '@utils/types';

async function connect(): Promise<Database> {
  let db: null | Database = null;

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
  const db = await connect();
  const result: Array<Account> = await db.select(
    'SELECT * FROM accounts WHERE is_active = 1;'
  );

  return result.length > 0;
}
