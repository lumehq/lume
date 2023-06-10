import { NDKTag, NDKUserProfile } from "@nostr-dev-kit/ndk";
import { getParentID } from "@utils/transform";
import { nip19 } from "nostr-tools";
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
	const result = await db.select("SELECT * FROM accounts WHERE is_active = 1;");
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
	npub: string,
	pubkey: string,
	privkey: string,
	follows?: string[][],
	is_active?: number,
) {
	const db = await connect();
	return await db.execute(
		"INSERT OR IGNORE INTO accounts (npub, pubkey, privkey, follows, is_active) VALUES (?, ?, ?, ?, ?);",
		[npub, pubkey, privkey, follows || "", is_active || 0],
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
export async function getPleb(npub: string) {
	const db = await connect();
	const result = await db.select(`SELECT * FROM plebs WHERE npub = "${npub}";`);

	if (result) {
		return result[0];
	} else {
		return null;
	}
}

// create pleb
export async function createPleb(key: string, data: NDKUserProfile) {
	const db = await connect();
	const now = Math.floor(Date.now() / 1000);
	let npub: string;

	if (key.substring(0, 4) === "npub") {
		npub = key;
	} else {
		npub = nip19.npubEncode(key);
	}

	return await db.execute(
		"INSERT OR REPLACE INTO plebs (npub, name, displayName, image, banner, bio, nip05, lud06, lud16, about, zapService, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
		[
			npub,
			data.name,
			data.displayName,
			data.image,
			data.banner,
			data.bio,
			data.nip05,
			data.lud06,
			data.lud16,
			data.about,
			data.zapService,
			now,
		],
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

// get all notes by authors
export async function getNotesByAuthor(
	pubkey: string,
	time: number,
	limit: number,
	offset: number,
) {
	const db = await connect();

	const notes: any = { data: null, nextCursor: 0 };
	const query: any = await db.select(
		`SELECT * FROM notes WHERE created_at <= "${time}" AND pubkey == "${pubkey}" AND kind IN (1, 6, 1063) GROUP BY parent_id ORDER BY created_at DESC LIMIT "${limit}" OFFSET "${offset}";`,
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
		`SELECT * FROM notes WHERE created_at <= "${time}" AND kind = 30023 ORDER BY created_at DESC LIMIT "${limit}" OFFSET "${offset}";`,
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
	pubkey: string,
	kind: number,
	tags: any,
	content: string,
	created_at: number,
) {
	const db = await connect();
	const account = await getActiveAccount();
	const parentID = getParentID(tags, event_id);

	return await db.execute(
		"INSERT OR IGNORE INTO notes (event_id, account_id, pubkey, kind, tags, content, created_at, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
		[event_id, account.id, pubkey, kind, tags, content, created_at, parentID],
	);
}

// create reply note
export async function createReplyNote(
	event_id: string,
	pubkey: string,
	kind: number,
	tags: any,
	content: string,
	created_at: number,
	parent_comment_id: string,
) {
	const db = await connect();
	const account = await getActiveAccount();
	const parentID = getParentID(tags, event_id);

	return await db.execute(
		"INSERT OR IGNORE INTO notes (event_id, account_id, pubkey, kind, tags, content, created_at, parent_id, parent_comment_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
		[
			event_id,
			account.id,
			pubkey,
			kind,
			tags,
			content,
			created_at,
			parentID,
			parent_comment_id,
		],
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
	const data = JSON.parse(value);

	return await db.execute(
		"UPDATE channels SET name = ?, picture = ?, about = ? WHERE event_id = ?;",
		[data.name, data.image, data.about, event_id],
	);
}

// get all chats by pubkey
export async function getChatsByPubkey(pubkey: string) {
	const db = await connect();
	return await db.select(
		`SELECT DISTINCT sender_pubkey FROM chats WHERE receiver_pubkey = "${pubkey}" ORDER BY created_at DESC;`,
	);
}

// get chat messages
export async function getChatMessages(
	receiver_pubkey: string,
	sender_pubkey: string,
) {
	const db = await connect();
	let receiver = [];

	const sender: any = await db.select(
		`SELECT * FROM chats WHERE sender_pubkey = "${sender_pubkey}" AND receiver_pubkey = "${receiver_pubkey}";`,
	);

	if (receiver_pubkey !== sender_pubkey) {
		receiver = await db.select(
			`SELECT * FROM chats WHERE sender_pubkey = "${receiver_pubkey}" AND receiver_pubkey = "${sender_pubkey}";`,
		);
	}

	const result = [...sender, ...receiver].sort(
		(x: { created_at: number }, y: { created_at: number }) =>
			x.created_at - y.created_at,
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
	created_at: number,
) {
	const db = await connect();
	return await db.execute(
		"INSERT OR IGNORE INTO chats (event_id, receiver_pubkey, sender_pubkey, content, tags, created_at) VALUES (?, ?, ?, ?, ?, ?);",
		[event_id, receiver_pubkey, sender_pubkey, content, tags, created_at],
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

// get all blocks
export async function getBlocks(account_id: number) {
	const db = await connect();
	return await db.select(
		`SELECT * FROM blocks WHERE account_id <= "${account_id}";`,
	);
}

// create block
export async function addBlockToDB(
	account_id: number,
	kind: number,
	title: string,
	content: any,
) {
	const db = await connect();
	return await db.execute(
		"INSERT OR IGNORE INTO blocks (account_id, kind, title, content) VALUES (?, ?, ?, ?);",
		[account_id, kind, title, content],
	);
}

export async function removeBlockFromDB(id: string) {
	const db = await connect();
	return await db.execute(`DELETE FROM blocks WHERE id = "${id}";`);
}
