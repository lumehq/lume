import Database from 'tauri-plugin-sql-api';

let db: null | Database = null;

// connect database (sqlite)
// path: tauri::api::path::BaseDirectory::App
export async function connect(): Promise<Database> {
  if (db) {
    return db;
  }
  db = await Database.load('sqlite:lume.db');
  return db;
}

// get active account
export async function getActiveAccount() {
  const db = await connect();
  // #TODO: check is_active == true
  const result = await db.select(`SELECT * FROM accounts LIMIT 1;`);
  return result[0];
}

// create account
export async function createAccount(pubkey: string, privkey: string, metadata: string) {
  const db = await connect();
  return await db.execute('INSERT OR IGNORE INTO accounts (pubkey, privkey, metadata) VALUES (?, ?, ?);', [
    pubkey,
    privkey,
    metadata,
  ]);
}

// update account
export async function updateAccount(column: string, value: string | string[], pubkey: string) {
  const db = await connect();
  return await db.execute(`UPDATE accounts SET ${column} = '${JSON.stringify(value)}' WHERE pubkey = "${pubkey}";`);
}

// create pleb
export async function createPleb(pubkey: string, metadata: string) {
  const db = await connect();
  return await db.execute('INSERT OR IGNORE INTO plebs (pubkey, metadata) VALUES (?, ?);', [pubkey, metadata]);
}

// count total notes
export async function countTotalNotes() {
  const db = await connect();
  const result = await db.select('SELECT COUNT(*) AS "total" FROM notes;');
  return result[0];
}

// get all notes
export async function getNotes(time: string, limit: number, offset: number) {
  const db = await connect();
  return await db.select(
    `SELECT * FROM notes WHERE created_at <= "${time}" ORDER BY created_at DESC LIMIT "${limit}" OFFSET "${offset}";`
  );
}

// get all latest notes
export async function getLatestNotes(time) {
  const db = await connect();
  return await db.select(`SELECT * FROM cache_notes WHERE created_at > "${time}" ORDER BY created_at DESC;`);
}
