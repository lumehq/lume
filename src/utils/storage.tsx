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
  return await db.select(`SELECT * FROM accounts LIMIT 1;`);
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
