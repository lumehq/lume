import { getParentID } from '@utils/transform';

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
  const result: any = await db.select('SELECT relay_url FROM relays WHERE relay_status = "1";');
  return result.reduce((relays, { relay_url }) => {
    relays.push(relay_url);
    return relays;
  }, []);
}

// get active account
export async function getActiveAccount() {
  const db = await connect();
  const result = await db.select(`SELECT * FROM accounts LIMIT 1;`);
  return result[0];
}

// get all accounts
export async function getAccounts() {
  const db = await connect();
  return await db.select(`SELECT * FROM accounts`);
}

// get all follows by account id
export async function getAllFollowsByID(id) {
  const db = await connect();
  return await db.select(`SELECT pubkey FROM follows WHERE account = "${id}";`);
}

// create account
export async function createAccount(data) {
  const db = await connect();
  return await db.execute(
    'INSERT OR IGNORE INTO accounts (id, privkey, npub, nsec, metadata) VALUES (?, ?, ?, ?, ?);',
    [data.pubkey, data.privkey, data.npub, data.nsec, data.metadata]
  );
}

// create follow
export async function createFollow(pubkey, account, kind) {
  const db = await connect();
  return await db.execute('INSERT OR IGNORE INTO follows (pubkey, account, kind) VALUES (?, ?, ?);', [
    pubkey,
    account,
    kind || 0,
  ]);
}

// create follow
export async function createFollows(data, account, kind) {
  const db = await connect();
  data.forEach(async (item) => {
    await db.execute('INSERT OR IGNORE INTO follows (pubkey, account, kind) VALUES (?, ?, ?);', [
      item,
      account,
      kind || 0,
    ]);
  });
  return 'ok';
}

// create cache profile
export async function createCacheProfile(id, metadata) {
  const db = await connect();
  return await db.execute('INSERT OR IGNORE INTO cache_profiles (id, metadata) VALUES (?, ?);', [id, metadata]);
}

// get cache profile
export async function getCacheProfile(id) {
  const db = await connect();
  const result = await db.select(`SELECT metadata FROM cache_profiles WHERE id = "${id}"`);
  return result[0];
}

// get all notes
export async function getAllNotes() {
  const db = await connect();
  return await db.select(`SELECT * FROM cache_notes GROUP BY parent_id ORDER BY created_at DESC LIMIT 1000`);
}

// get note by id
export async function getNoteByID(id) {
  const db = await connect();
  const result = await db.select(`SELECT * FROM cache_notes WHERE id = "${id}"`);
  return result[0];
}

// create cache note
export async function createCacheNote(data) {
  const db = await connect();
  return await db.execute(
    'INSERT OR IGNORE INTO cache_notes (id, pubkey, created_at, kind, content, tags, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?);',
    [
      data.id,
      data.pubkey,
      data.created_at,
      data.kind,
      data.content,
      JSON.stringify(data.tags),
      getParentID(data.tags, data.id),
    ]
  );
}

// get all comment notes
export async function getAllCommentNotes(eid) {
  const db = await connect();
  return await db.select(
    `SELECT * FROM cache_notes WHERE parent_comment_id = "${eid}" ORDER BY created_at DESC LIMIT 1000`
  );
}

// create cache comment note
export async function createCacheCommentNote(data, eid) {
  const db = await connect();
  return await db.execute(
    'INSERT OR IGNORE INTO cache_notes (id, pubkey, created_at, kind, content, tags, parent_id, parent_comment_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
    [
      data.id,
      data.pubkey,
      data.created_at,
      data.kind,
      data.content,
      JSON.stringify(data.tags),
      getParentID(data.tags, data.id),
      eid,
    ]
  );
}
