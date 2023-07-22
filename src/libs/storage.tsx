import destr from 'destr';
import Database from 'tauri-plugin-sql-api';

import { getParentID } from '@utils/transform';
import { Account, Block, Chats, LumeEvent, Profile, Settings } from '@utils/types';

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
  const result: Array<Account> = await db.select(
    'SELECT * FROM accounts WHERE is_active = 1;'
  );
  if (result.length > 0) {
    return result[0];
  } else {
    return null;
  }
}

// get all accounts
export async function getAccounts() {
  const db = await connect();
  const result: Array<Account> = await db.select(
    'SELECT * FROM accounts WHERE is_active = 0 ORDER BY created_at DESC;'
  );
  return result;
}

// create account
export async function createAccount(
  npub: string,
  pubkey: string,
  follows?: string[][],
  is_active?: number
) {
  const db = await connect();
  const res = await db.execute(
    'INSERT OR IGNORE INTO accounts (npub, pubkey, privkey, follows, is_active) VALUES (?, ?, ?, ?, ?);',
    [npub, pubkey, 'privkey is stored in secure storage', follows || '', is_active || 0]
  );
  if (res) {
    await createBlock(
      0,
      'Have fun together!',
      'https://void.cat/d/949GNg7ZjSLHm2eTR3jZqv'
    );
  }
  const getAccount = await getActiveAccount();
  return getAccount;
}

// update account
export async function updateAccount(
  column: string,
  value: string | string[],
  pubkey: string
) {
  const db = await connect();
  return await db.execute(`UPDATE accounts SET ${column} = ? WHERE pubkey = ?;`, [
    value,
    pubkey,
  ]);
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
  const result: Array<{ total: string }> = await db.select(
    'SELECT COUNT(*) AS "total" FROM notes WHERE kind IN (1, 6);'
  );
  return parseInt(result[0].total);
}

// get all notes
export async function getNotes(limit: number, offset: number) {
  const db = await connect();
  const totalNotes = await countTotalNotes();
  const nextCursor = offset + limit;

  const notes: { data: LumeEvent[] | null; nextCursor: number } = {
    data: null,
    nextCursor: 0,
  };

  const query: LumeEvent[] = await db.select(
    `SELECT * FROM notes WHERE kind IN (1, 6, 1063) GROUP BY parent_id ORDER BY created_at DESC LIMIT "${limit}" OFFSET "${offset}";`
  );

  query.forEach(
    (el) => (el.tags = typeof el.tags === 'string' ? destr(el.tags) : el.tags)
  );

  notes['data'] = query;
  notes['nextCursor'] = Math.round(totalNotes / nextCursor) > 1 ? nextCursor : undefined;

  return notes;
}

// get all notes by pubkey
export async function getNotesByPubkey(pubkey: string) {
  const db = await connect();

  const query: LumeEvent[] = await db.select(
    `SELECT * FROM notes WHERE pubkey == "${pubkey}" AND kind IN (1, 6, 1063) GROUP BY parent_id ORDER BY created_at DESC;`
  );

  query.forEach(
    (el) => (el.tags = typeof el.tags === 'string' ? destr(el.tags) : el.tags)
  );

  return query;
}

// get all notes by authors
export async function getNotesByAuthors(authors: string, limit: number, offset: number) {
  const db = await connect();
  const totalNotes = await countTotalNotes();
  const nextCursor = offset + limit;
  const array = JSON.parse(authors);
  const finalArray = `'${array.join("','")}'`;

  const notes: { data: LumeEvent[] | null; nextCursor: number } = {
    data: null,
    nextCursor: 0,
  };

  const query: LumeEvent[] = await db.select(
    `SELECT * FROM notes WHERE pubkey IN (${finalArray}) AND kind IN (1, 6, 1063) GROUP BY parent_id ORDER BY created_at DESC LIMIT "${limit}" OFFSET "${offset}";`
  );

  query.forEach(
    (el) => (el.tags = typeof el.tags === 'string' ? destr(el.tags) : el.tags)
  );

  notes['data'] = query;
  notes['nextCursor'] = Math.round(totalNotes / nextCursor) > 1 ? nextCursor : undefined;

  return notes;
}

// get note by id
export async function getNoteByID(event_id: string) {
  const db = await connect();
  const result = await db.select(`SELECT * FROM notes WHERE event_id = "${event_id}";`);
  return result[0];
}

// create note
export async function createNote(
  event_id: string,
  pubkey: string,
  kind: number,
  tags: string[][],
  content: string,
  created_at: number
) {
  const db = await connect();
  const account = await getActiveAccount();
  const parentID = getParentID(tags, event_id);

  return await db.execute(
    'INSERT OR IGNORE INTO notes (event_id, account_id, pubkey, kind, tags, content, created_at, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
    [event_id, account.id, pubkey, kind, tags, content, created_at, parentID]
  );
}

// get note replies
export async function getReplies(parent_id: string) {
  const db = await connect();
  const result: Array<LumeEvent> = await db.select(
    `SELECT * FROM replies WHERE parent_id = "${parent_id}" ORDER BY created_at DESC;`
  );
  return result;
}

// create reply note
export async function createReplyNote(
  parent_id: string,
  event_id: string,
  pubkey: string,
  kind: number,
  tags: string[][],
  content: string,
  created_at: number
) {
  const db = await connect();
  return await db.execute(
    'INSERT OR IGNORE INTO replies (event_id, parent_id, pubkey, kind, tags, content, created_at) VALUES (?, ?, ?, ?, ?, ?, ?);',
    [event_id, parent_id, pubkey, kind, tags, content, created_at]
  );
}

// get all pubkeys in db
export async function getAllPubkeys() {
  const db = await connect();
  const notes: any = await db.select('SELECT DISTINCT pubkey FROM notes');
  const replies: any = await db.select('SELECT DISTINCT pubkey FROM replies');
  const chats: any = await db.select('SELECT DISTINCT sender_pubkey FROM chats');
  return [...notes, ...replies, ...chats];
}

// get all channels
export async function getChannels() {
  const db = await connect();
  const result: any = await db.select('SELECT * FROM channels ORDER BY created_at DESC;');
  return result;
}

// get channel by id
export async function getChannel(id: string) {
  const db = await connect();
  const result = await db.select(`SELECT * FROM channels WHERE event_id = "${id}";`);
  return result[0];
}

// create channel
export async function createChannel(
  event_id: string,
  pubkey: string,
  name: string,
  picture: string,
  about: string,
  created_at: number
) {
  const db = await connect();
  return await db.execute(
    'INSERT OR IGNORE INTO channels (event_id, pubkey, name, picture, about, created_at) VALUES (?, ?, ?, ?, ?, ?);',
    [event_id, pubkey, name, picture, about, created_at]
  );
}

// update channel metadata
export async function updateChannelMetadata(event_id: string, value: string) {
  const db = await connect();
  const data = JSON.parse(value);

  return await db.execute(
    'UPDATE channels SET name = ?, picture = ?, about = ? WHERE event_id = ?;',
    [data.name, data.picture, data.about, event_id]
  );
}

// create channel messages
export async function createChannelMessage(
  channel_id: string,
  event_id: string,
  pubkey: string,
  kind: number,
  content: string,
  tags: string[][],
  created_at: number
) {
  const db = await connect();
  return await db.execute(
    'INSERT OR IGNORE INTO channel_messages (channel_id, event_id, pubkey, kind, content, tags, created_at) VALUES (?, ?, ?, ?, ?, ?, ?);',
    [channel_id, event_id, pubkey, kind, content, tags, created_at]
  );
}

// get channel messages by channel id
export async function getChannelMessages(channel_id: string) {
  const db = await connect();
  return await db.select(
    `SELECT * FROM channel_messages WHERE channel_id = "${channel_id}" ORDER BY created_at ASC;`
  );
}

// get channel users
export async function getChannelUsers(channel_id: string) {
  const db = await connect();
  const result: any = await db.select(
    `SELECT DISTINCT pubkey FROM channel_messages WHERE channel_id = "${channel_id}";`
  );
  return result;
}

// get all chats by pubkey
export async function getChats() {
  const db = await connect();
  const account = await getActiveAccount();
  const follows =
    typeof account.follows === 'string' ? JSON.parse(account.follows) : account.follows;

  const chats: { follows: Array<Chats> | null; unknown: number } = {
    follows: [],
    unknown: 0,
  };

  let result: Array<Chats> = await db.select(
    `SELECT DISTINCT sender_pubkey FROM chats WHERE receiver_pubkey = "${account.pubkey}" ORDER BY created_at DESC;`
  );

  result = result.map((v) => ({ ...v, new_messages: 0 }));
  result = result.sort((a, b) => a.new_messages - b.new_messages);

  chats.follows = result.filter((el) => {
    return follows.some((i) => {
      return i === el.sender_pubkey;
    });
  });

  chats.unknown = result.length - chats.follows.length;

  return chats;
}

// get chat messages
export async function getChatMessages(receiver_pubkey: string, sender_pubkey: string) {
  const db = await connect();
  let receiver = [];

  const sender: Array<Chats> = await db.select(
    `SELECT * FROM chats WHERE sender_pubkey = "${sender_pubkey}" AND receiver_pubkey = "${receiver_pubkey}";`
  );

  if (receiver_pubkey !== sender_pubkey) {
    receiver = await db.select(
      `SELECT * FROM chats WHERE sender_pubkey = "${receiver_pubkey}" AND receiver_pubkey = "${sender_pubkey}";`
    );
  }

  const result = [...sender, ...receiver].sort(
    (x: { created_at: number }, y: { created_at: number }) => x.created_at - y.created_at
  );

  return result;
}

// create chat
export async function createChat(
  event_id: string,
  receiver_pubkey: string,
  sender_pubkey: string,
  content: string,
  tags: string[][],
  created_at: number
) {
  const db = await connect();
  await db.execute(
    'INSERT OR IGNORE INTO chats (event_id, receiver_pubkey, sender_pubkey, content, tags, created_at) VALUES (?, ?, ?, ?, ?, ?);',
    [event_id, receiver_pubkey, sender_pubkey, content, tags, created_at]
  );
  return sender_pubkey;
}

// get setting
export async function getSetting(key: string) {
  const db = await connect();
  const result: Array<Settings> = await db.select(
    `SELECT value FROM settings WHERE key = "${key}";`
  );
  return result[0]?.value;
}

// update setting
export async function updateSetting(key: string, value: string | number) {
  const db = await connect();
  return await db.execute(`UPDATE settings SET value = "${value}" WHERE key = "${key}";`);
}

// get last login
export async function getLastLogin() {
  const db = await connect();
  const result: Array<Settings> = await db.select(
    `SELECT value FROM settings WHERE key = "last_login";`
  );
  if (result[0]) {
    return parseInt(result[0].value);
  } else {
    return 0;
  }
}

// update last login
export async function updateLastLogin(value: number) {
  const db = await connect();
  return await db.execute(
    `UPDATE settings SET value = ${value} WHERE key = "last_login";`
  );
}

// get all blocks
export async function getBlocks() {
  const db = await connect();
  const account = await getActiveAccount();
  const result: Array<Block> = await db.select(
    `SELECT * FROM blocks WHERE account_id = "${account.id}" ORDER BY created_at DESC;`
  );
  return result;
}

// create block
export async function createBlock(
  kind: number,
  title: string,
  content: string | string[]
) {
  const db = await connect();
  const activeAccount = await getActiveAccount();
  return await db.execute(
    'INSERT OR IGNORE INTO blocks (account_id, kind, title, content) VALUES (?, ?, ?, ?);',
    [activeAccount.id, kind, title, content]
  );
}

// remove block
export async function removeBlock(id: string) {
  const db = await connect();
  return await db.execute(`DELETE FROM blocks WHERE id = "${id}";`);
}

// logout
export async function removeAll() {
  const db = await connect();
  await db.execute(`UPDATE settings SET value = "0" WHERE key = "last_login";`);
  await db.execute('DELETE FROM replies;');
  await db.execute('DELETE FROM notes;');
  await db.execute('DELETE FROM blacklist;');
  await db.execute('DELETE FROM blocks;');
  await db.execute('DELETE FROM chats;');
  await db.execute('DELETE FROM accounts;');
  return true;
}

// create metadata
export async function createMetadata(id: string, pubkey: string, content: string) {
  const db = await connect();
  const now = Math.floor(Date.now() / 1000);
  return await db.execute(
    'INSERT OR REPLACE INTO metadata (id, pubkey, content, created_at) VALUES (?, ?, ?, ?);',
    [id, pubkey, content, now]
  );
}

export async function getAllMetadata() {
  const db = await connect();
  const result: LumeEvent[] = await db.select(`SELECT * FROM metadata;`);
  const users: Profile[] = result.map((el) => {
    const profile: Profile = destr(el.content);
    return {
      pubkey: el.pubkey,
      ident: profile.name || profile.display_name || profile.username,
      picture: profile.picture || profile.image,
    };
  });
  return users;
}

// get user metadata
export async function getUserMetadata(pubkey: string) {
  const db = await connect();
  const result = await db.select(`SELECT * FROM metadata WHERE pubkey = "${pubkey}";`);
  if (result[0]) {
    return result[0];
  } else {
    return null;
  }
}

// delete privkey
export async function removePrivkey() {
  const db = await connect();
  const activeAccount = await getActiveAccount();
  return await db.execute(
    `UPDATE accounts SET privkey = "privkey is stored in secure storage" WHERE id = "${activeAccount.id}";`
  );
}
