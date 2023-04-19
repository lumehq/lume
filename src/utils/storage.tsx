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

// get all accounts
export async function getAccounts() {
  const db = await connect();
  return await db.select(`SELECT * FROM accounts ORDER BY created_at DESC;`);
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
  if (Array.isArray(value)) {
    return await db.execute(`UPDATE accounts SET ${column} = '${JSON.stringify(value)}' WHERE pubkey = "${pubkey}";`);
  } else {
    return await db.execute(`UPDATE accounts SET ${column} = "${value}" WHERE pubkey = "${pubkey}";`);
  }
}

// get all plebs
export async function getPlebs() {
  const db = await connect();
  return await db.select(`SELECT * FROM plebs ORDER BY created_at DESC;`);
}

// create pleb
export async function createPleb(pubkey: string, metadata: string) {
  const db = await connect();
  return await db.execute('INSERT OR IGNORE INTO plebs (pubkey, metadata) VALUES (?, ?);', [pubkey, metadata]);
}

// count total notes
export async function countTotalChannels() {
  const db = await connect();
  const result = await db.select('SELECT COUNT(*) AS "total" FROM channels;');
  return result[0];
}

// count total notes
export async function countTotalNotes() {
  const db = await connect();
  const result = await db.select('SELECT COUNT(*) AS "total" FROM notes;');
  return result[0];
}

// get all notes
export async function getNotes(time: number, limit: number, offset: number) {
  const db = await connect();
  return await db.select(
    `SELECT * FROM notes WHERE created_at <= "${time}" ORDER BY created_at DESC LIMIT "${limit}" OFFSET "${offset}";`
  );
}

// get note by id
export async function getNoteByID(event_id: string) {
  const db = await connect();
  const result = await db.select(`SELECT * FROM notes WHERE event_id = "${event_id}";`);
  return result[0];
}

// get all latest notes
export async function getLatestNotes(time: number) {
  const db = await connect();
  return await db.select(`SELECT * FROM notes WHERE created_at > "${time}" ORDER BY created_at DESC;`);
}

// create note
export async function createNote(
  event_id: string,
  account_id: number,
  pubkey: string,
  kind: number,
  tags: string[],
  content: string,
  created_at: number,
  parent_id: string
) {
  const db = await connect();
  return await db.execute(
    'INSERT OR IGNORE INTO notes (event_id, account_id, pubkey, kind, tags, content, created_at, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
    [event_id, account_id, pubkey, kind, tags, content, created_at, parent_id]
  );
}

// get all channels
export async function getChannels(limit: number, offset: number) {
  const db = await connect();
  return await db.select(`SELECT * FROM channels ORDER BY created_at DESC LIMIT "${limit}" OFFSET "${offset}";`);
}

// create channel
export async function createChannel(event_id: string, metadata: string, created_at: number) {
  const db = await connect();
  return await db.execute('INSERT OR IGNORE INTO channels (event_id, metadata, created_at) VALUES (?, ?, ?);', [
    event_id,
    metadata,
    created_at,
  ]);
}

// update channel metadata
export async function updateChannelMetadata(event_id: string, value: string) {
  const db = await connect();
  return await db.execute(`UPDATE channels SET metadata = "${value}" WHERE event_id = "${event_id}";`);
}

// get all chats
export async function getChats(account_id: number) {
  const db = await connect();
  return await db.select(`SELECT * FROM chats WHERE account_id <= "${account_id}" ORDER BY created_at DESC;`);
}

// create chat
export async function createChat(account_id: number, pubkey: string, created_at: number) {
  const db = await connect();
  return await db.execute('INSERT OR IGNORE INTO chats (account_id, pubkey, created_at) VALUES (?, ?, ?);', [
    account_id,
    pubkey,
    created_at,
  ]);
}
