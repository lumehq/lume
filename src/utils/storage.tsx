import Database from "tauri-plugin-sql-api";

let db: null | Database = null;

// connect database (sqlite)
// path: tauri::api::path::BaseDirectory::App
export async function connect(): Promise<Database> {
	if (db) {
		return db;
	}
	db = await Database.load("sqlite:lume.db");
	return db;
}

// get active account
export async function getActiveAccount() {
	const db = await connect();
	// #TODO: check is_active == true
	const result = await db.select(
		"SELECT * FROM accounts WHERE is_active = 1 LIMIT 1;",
	);
	return result[0];
}

// get all accounts
export async function getAccounts() {
	const db = await connect();
	return await db.select(
		"SELECT * FROM accounts WHERE is_active = 0 ORDER BY created_at DESC;",
	);
}

// create account
export async function createAccount(
	pubkey: string,
	privkey: string,
	metadata: string,
	follows?: string[][],
	is_active?: number,
) {
	const db = await connect();
	return await db.execute(
		"INSERT OR IGNORE INTO accounts (pubkey, privkey, metadata, follows, is_active) VALUES (?, ?, ?, ?, ?);",
		[pubkey, privkey, metadata, follows || "", is_active || 0],
	);
}

// update account
export async function updateAccount(
	column: string,
	value: string | string[],
	pubkey: string,
) {
	const db = await connect();
	return await db.execute(
		`UPDATE accounts SET ${column} = ? WHERE pubkey = ?;`,
		[value, pubkey],
	);
}

// get all plebs
export async function getPlebs() {
	const db = await connect();
	return await db.select("SELECT * FROM plebs ORDER BY created_at DESC;");
}

// get pleb by pubkey
export async function getPleb(pubkey: string) {
	const db = await connect();
	const result = await db.select(
		`SELECT * FROM plebs WHERE pubkey = "${pubkey}"`,
	);
	return result[0];
}

// create pleb
export async function createPleb(pubkey: string, metadata: string) {
	const db = await connect();
	return await db.execute(
		"INSERT OR IGNORE INTO plebs (pubkey, metadata) VALUES (?, ?);",
		[pubkey, metadata],
	);
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
	const result = await db.select(
		'SELECT COUNT(*) AS "total" FROM notes WHERE kind IN (1, 6);',
	);
	return result[0].total;
}

// count total notes
export async function countTotalLongNotes() {
	const db = await connect();
	const result = await db.select(
		'SELECT COUNT(*) AS "total" FROM notes WHERE kind = 30023;',
	);
	return result[0].total;
}

// get all notes
export async function getNotes(time: number, limit: number, offset: number) {
	const db = await connect();

	const notes: any = { data: null, nextCursor: 0 };
	const query: any = await db.select(
		`SELECT * FROM notes WHERE created_at <= "${time}" AND kind IN (1, 6, 1063) GROUP BY parent_id ORDER BY created_at DESC LIMIT "${limit}" OFFSET "${offset}";`,
	);

	notes["data"] = query;
	notes["nextCursor"] = offset + limit;

	return notes;
}

// get all long notes
export async function getLongNotes(
	time: number,
	limit: number,
	offset: number,
) {
	const db = await connect();

	const notes: any = { data: null, nextCursor: 0 };
	const query: any = await db.select(
		`SELECT * FROM notes WHERE created_at <= "${time}" AND kind = 30023 GROUP BY parent_id ORDER BY created_at DESC LIMIT "${limit}" OFFSET "${offset}";`,
	);

	notes["data"] = query;
	notes["nextCursor"] = offset + limit;

	return notes;
}

// get all note authors
export async function getNoteAuthors() {
	const db = await connect();
	const result = await db.select(
		"SELECT DISTINCT pubkey FROM notes ORDER BY created_at DESC",
	);
	return result;
}

// get note by id
export async function getNoteByID(event_id: string) {
	const db = await connect();
	const result = await db.select(
		`SELECT * FROM notes WHERE event_id = "${event_id}";`,
	);
	return result[0];
}

// get all latest notes
export async function getLatestNotes(time: number) {
	const db = await connect();
	return await db.select(
		`SELECT * FROM notes WHERE created_at > "${time}" GROUP BY parent_id ORDER BY created_at DESC;`,
	);
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
	parent_id: string,
) {
	const db = await connect();
	return await db.execute(
		"INSERT OR IGNORE INTO notes (event_id, account_id, pubkey, kind, tags, content, created_at, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
		[event_id, account_id, pubkey, kind, tags, content, created_at, parent_id],
	);
}

// get all channels
export async function getChannels(limit: number, offset: number) {
	const db = await connect();
	return await db.select(
		`SELECT * FROM channels ORDER BY created_at DESC LIMIT "${limit}" OFFSET "${offset}";`,
	);
}

// get channel by id
export async function getChannel(id: string) {
	const db = await connect();
	const result = await db.select(
		`SELECT * FROM channels WHERE event_id = "${id}";`,
	);
	return result[0];
}

// create channel
export async function createChannel(
	event_id: string,
	pubkey: string,
	metadata: string,
	created_at: number,
) {
	const db = await connect();
	return await db.execute(
		"INSERT OR IGNORE INTO channels (event_id, pubkey, metadata, created_at) VALUES (?, ?, ?, ?);",
		[event_id, pubkey, metadata, created_at],
	);
}

// update channel metadata
export async function updateChannelMetadata(event_id: string, value: string) {
	const db = await connect();
	return await db.execute(
		"UPDATE channels SET metadata = ? WHERE event_id = ?;",
		[value, event_id],
	);
}

// get all chats
export async function getChats(account_id: number) {
	const db = await connect();
	return await db.select(
		`SELECT * FROM chats WHERE account_id <= "${account_id}" ORDER BY created_at DESC;`,
	);
}

// create chat
export async function createChat(
	account_id: number,
	pubkey: string,
	created_at: number,
) {
	const db = await connect();
	return await db.execute(
		"INSERT OR IGNORE INTO chats (account_id, pubkey, created_at) VALUES (?, ?, ?);",
		[account_id, pubkey, created_at],
	);
}

// get last login
export async function getLastLogin() {
	const db = await connect();
	const result = await db.select(
		`SELECT value FROM settings WHERE key = "last_login";`,
	);
	return result[0]?.value;
}

// update last login
export async function updateLastLogin(value: number) {
	const db = await connect();
	return await db.execute(
		`UPDATE settings SET value = ${value} WHERE key = "last_login";`,
	);
}

// get blacklist by kind and account id
export async function getBlacklist(account_id: number, kind: number) {
	const db = await connect();
	return await db.select(
		`SELECT * FROM blacklist WHERE account_id = "${account_id}" AND kind = "${kind}";`,
	);
}

// get active blacklist by kind and account id
export async function getActiveBlacklist(account_id: number, kind: number) {
	const db = await connect();
	return await db.select(
		`SELECT content FROM blacklist WHERE account_id = "${account_id}" AND kind = "${kind}" AND status = 1;`,
	);
}

// add to blacklist
export async function addToBlacklist(
	account_id: number,
	content: string,
	kind: number,
	status?: number,
) {
	const db = await connect();
	return await db.execute(
		"INSERT OR IGNORE INTO blacklist (account_id, content, kind, status) VALUES (?, ?, ?, ?);",
		[account_id, content, kind, status || 1],
	);
}

// update item in blacklist
export async function updateItemInBlacklist(content: string, status: number) {
	const db = await connect();
	return await db.execute(
		`UPDATE blacklist SET status = "${status}" WHERE content = "${content}";`,
	);
}
