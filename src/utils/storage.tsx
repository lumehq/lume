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

// get all relays
export async function getAllRelays() {
  const db = await connect();
  return await db.select('SELECT relay_url FROM relays WHERE relay_status = "1"');
}

// get active account
export async function getActiveAccount() {
  const db = await connect();
  return await db.select(`SELECT * FROM accounts LIMIT 1`);
}

// get all follows by account id
export async function getAllFollowsByID(id: string) {
  const db = await connect();
  return await db.select(`SELECT pubkey FROM follows WHERE account = "${id}"`);
}
