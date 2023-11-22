import { NDKEvent } from '@nostr-dev-kit/ndk';
import { invoke } from '@tauri-apps/api/primitives';
import { Platform } from '@tauri-apps/plugin-os';
import Database from '@tauri-apps/plugin-sql';

import { FULL_RELAYS } from '@stores/constants';

import { rawEvent } from '@utils/transform';
import type {
  Account,
  DBEvent,
  NDKCacheEvent,
  NDKCacheEventTag,
  NDKCacheUser,
  Relays,
  Widget,
} from '@utils/types';

export class LumeStorage {
  public db: Database;
  public account: Account | null;
  public platform: Platform | null;
  public settings: {
    autoupdate: boolean;
    outbox: boolean;
    media: boolean;
    hashtag: boolean;
  };

  constructor(sqlite: Database, platform: Platform) {
    this.db = sqlite;
    this.account = null;
    this.platform = platform;
    this.settings = { autoupdate: false, outbox: false, media: true, hashtag: true };
  }

  public async secureSave(key: string, value: string) {
    return await invoke('secure_save', { key, value });
  }

  public async secureLoad(key: string) {
    try {
      const value: string = await invoke('secure_load', { key });
      if (!value) return null;
      return value;
    } catch {
      return null;
    }
  }

  public async secureRemove(key: string) {
    return await invoke('secure_remove', { key });
  }

  public async getCacheUser(pubkey: string) {
    const results: Array<NDKCacheUser> = await this.db.select(
      'SELECT * FROM ndk_users WHERE pubkey = $1 ORDER BY pubkey DESC LIMIT 1;',
      [pubkey]
    );

    if (results.length < 1) return null;

    if (typeof results[0].profile === 'string')
      results[0].profile = JSON.parse(results[0].profile);

    return results[0];
  }

  public async getCacheEvent(id: string) {
    const results: Array<NDKCacheEvent> = await this.db.select(
      'SELECT * FROM ndk_events WHERE id = $1 ORDER BY id DESC LIMIT 1;',
      [id]
    );

    if (results.length < 1) return null;
    return results[0];
  }

  public async getCacheEvents(ids: string[]) {
    const idsArr = `'${ids.join("','")}'`;

    const results: Array<NDKCacheEvent> = await this.db.select(
      `SELECT * FROM ndk_events WHERE id IN (${idsArr}) ORDER BY id;`
    );

    if (results.length < 1) return [];
    return results;
  }

  public async getCacheEventsByPubkey(pubkey: string) {
    const results: Array<NDKCacheEvent> = await this.db.select(
      'SELECT * FROM ndk_events WHERE pubkey = $1 ORDER BY id;',
      [pubkey]
    );

    if (results.length < 1) return [];
    return results;
  }

  public async getCacheEventsByKind(kind: number) {
    const results: Array<NDKCacheEvent> = await this.db.select(
      'SELECT * FROM ndk_events WHERE kind = $1 ORDER BY id;',
      [kind]
    );

    if (results.length < 1) return [];
    return results;
  }

  public async getCacheEventsByKindAndAuthor(kind: number, pubkey: string) {
    const results: Array<NDKCacheEvent> = await this.db.select(
      'SELECT * FROM ndk_events WHERE kind = $1 AND pubkey = $2 ORDER BY id;',
      [kind, pubkey]
    );

    if (results.length < 1) return [];
    return results;
  }

  public async getCacheEventTagsByTagValue(tagValue: string) {
    const results: Array<NDKCacheEventTag> = await this.db.select(
      'SELECT * FROM ndk_eventtags WHERE tagValue = $1 ORDER BY id;',
      [tagValue]
    );

    if (results.length < 1) return [];
    return results;
  }

  public async setCacheEvent({
    id,
    pubkey,
    content,
    kind,
    createdAt,
    relay,
    event,
  }: NDKCacheEvent) {
    return await this.db.execute(
      'INSERT OR IGNORE INTO ndk_events (id, pubkey, content, kind, createdAt, relay, event) VALUES ($1, $2, $3, $4, $5, $6, $7);',
      [id, pubkey, content, kind, createdAt, relay, event]
    );
  }

  public async setCacheEventTag({ id, eventId, tag, value, tagValue }: NDKCacheEventTag) {
    return await this.db.execute(
      'INSERT OR IGNORE INTO ndk_eventtags (id, eventId, tag, value, tagValue) VALUES ($1, $2, $3, $4, $5);',
      [id, eventId, tag, value, tagValue]
    );
  }

  public async setCacheProfiles(profiles: Array<NDKCacheUser>) {
    return await Promise.all(
      profiles.map(
        async (profile) =>
          await this.db.execute(
            'INSERT OR IGNORE INTO ndk_users (pubkey, profile, createdAt) VALUES ($1, $2, $3);',
            [profile.pubkey, profile.profile, profile.createdAt]
          )
      )
    );
  }

  public async checkAccount() {
    const result: Array<{ total: string }> = await this.db.select(
      'SELECT COUNT(*) AS "total" FROM accounts;'
    );
    return parseInt(result[0].total);
  }

  public async getActiveAccount() {
    const results: Array<Account> = await this.db.select(
      'SELECT * FROM accounts WHERE is_active = "1" ORDER BY id DESC LIMIT 1;'
    );

    if (results.length > 0) {
      const account = results[0];

      if (typeof account.follows === 'string')
        account.follows = JSON.parse(account.follows) ?? [];

      if (typeof account.circles === 'string')
        account.circles = JSON.parse(account.circles) ?? [];

      if (typeof account.last_login_at === 'string')
        account.last_login_at = parseInt(account.last_login_at);

      this.account = account;
      return account;
    } else {
      console.log('no active account, please create new account');
      return null;
    }
  }

  public async createAccount(npub: string, pubkey: string) {
    const existAccounts: Array<Account> = await this.db.select(
      'SELECT * FROM accounts WHERE pubkey = $1 ORDER BY id DESC LIMIT 1;',
      [pubkey]
    );

    if (existAccounts.length > 0) {
      await this.db.execute("UPDATE accounts SET is_active = '1' WHERE pubkey = $1;", [
        pubkey,
      ]);
    } else {
      await this.db.execute(
        'INSERT OR IGNORE INTO accounts (id, pubkey, is_active) VALUES ($1, $2, $3);',
        [npub, pubkey, 1]
      );
    }

    const account = await this.getActiveAccount();
    return account;
  }

  public async updateAccount(column: string, value: string) {
    const insert = await this.db.execute(
      `UPDATE accounts SET ${column} = $1 WHERE id = $2;`,
      [value, this.account.id]
    );

    if (insert) {
      const account = await this.getActiveAccount();
      return account;
    }
  }

  public async updateLastLogin() {
    const now = Math.floor(Date.now() / 1000);
    this.account.last_login_at = now;
    return await this.db.execute(
      'UPDATE accounts SET last_login_at = $1 WHERE id = $2;',
      [now, this.account.id]
    );
  }

  public async getWidgets() {
    const widgets: Array<Widget> = await this.db.select(
      'SELECT * FROM widgets WHERE account_id = $1 ORDER BY created_at DESC;',
      [this.account.id]
    );
    return widgets;
  }

  public async createWidget(kind: number, title: string, content: string | string[]) {
    const insert = await this.db.execute(
      'INSERT INTO widgets (account_id, kind, title, content) VALUES ($1, $2, $3, $4);',
      [this.account.id, kind, title, content]
    );

    if (insert) {
      const widgets: Array<Widget> = await this.db.select(
        'SELECT * FROM widgets ORDER BY id DESC LIMIT 1;'
      );
      if (widgets.length < 1) console.error('get created widget failed');
      return widgets[0];
    } else {
      console.error('create widget failed');
    }
  }

  public async removeWidget(id: string) {
    const res = await this.db.execute('DELETE FROM widgets WHERE id = $1;', [id]);
    if (res) return id;
  }

  public async createEvent(event: NDKEvent) {
    const rawNostrEvent = rawEvent(event);

    let root: string;
    let reply: string;

    if (event.tags?.[0]?.[0] === 'e' && !event.tags?.[0]?.[3]) {
      root = event.tags[0][1];
    } else {
      root = event.tags.find((el) => el[3] === 'root')?.[1];
      reply = event.tags.find((el) => el[3] === 'reply')?.[1];
    }

    return await this.db.execute(
      'INSERT OR IGNORE INTO events (id, account_id, event, author, kind, root_id, reply_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);',
      [
        event.id,
        this.account.id,
        JSON.stringify(rawNostrEvent),
        event.pubkey,
        event.kind,
        root,
        reply,
        event.created_at,
      ]
    );
  }

  public async getEventByID(id: string) {
    const results: DBEvent[] = await this.db.select(
      'SELECT * FROM events WHERE id = $1 LIMIT 1;',
      [id]
    );

    if (results.length < 1) return null;
    return JSON.parse(results[0].event as string) as NDKEvent;
  }

  public async countTotalEvents() {
    const result: Array<{ total: string }> = await this.db.select(
      'SELECT COUNT(*) AS "total" FROM events WHERE account_id = $1;',
      [this.account.id]
    );
    return parseInt(result[0].total);
  }

  public async getAllEvents(limit: number, offset: number) {
    const totalEvents = await this.countTotalEvents();
    const nextCursor = offset + limit;

    const events: { data: DBEvent[] | null; nextCursor: number } = {
      data: null,
      nextCursor: 0,
    };

    const query: DBEvent[] = await this.db.select(
      'SELECT * FROM events WHERE account_id = $1 GROUP BY root_id ORDER BY created_at DESC LIMIT $2 OFFSET $3;',
      [this.account.id, limit, offset]
    );

    if (query && query.length > 0) {
      events['data'] = query;
      events['nextCursor'] =
        Math.round(totalEvents / nextCursor) > 1 ? nextCursor : undefined;

      return events;
    }

    return {
      data: [],
      nextCursor: 0,
    };
  }

  public async getAllEventsByAuthors(authors: string[], limit: number, offset: number) {
    const totalEvents = await this.countTotalEvents();
    const nextCursor = offset + limit;
    const authorsArr = `'${authors.join("','")}'`;

    const events: { data: DBEvent[] | null; nextCursor: number } = {
      data: null,
      nextCursor: 0,
    };

    const query: DBEvent[] = await this.db.select(
      `SELECT * FROM events WHERE author IN (${authorsArr}) ORDER BY created_at DESC LIMIT $1 OFFSET $2;`,
      [limit, offset]
    );

    if (query && query.length > 0) {
      events['data'] = query;
      events['nextCursor'] =
        Math.round(totalEvents / nextCursor) > 1 ? nextCursor : undefined;

      return events;
    }

    return {
      data: [],
      nextCursor: 0,
    };
  }

  public async getAllEventsByKinds(kinds: number[], limit: number, offset: number) {
    const totalEvents = await this.countTotalEvents();
    const nextCursor = offset + limit;
    const authorsArr = `'${kinds.join("','")}'`;

    const events: { data: DBEvent[] | null; nextCursor: number } = {
      data: null,
      nextCursor: 0,
    };

    const query: DBEvent[] = await this.db.select(
      `SELECT * FROM events WHERE kinds IN (${authorsArr}) AND account_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;`,
      [this.account.id, limit, offset]
    );

    if (query && query.length > 0) {
      events['data'] = query;
      events['nextCursor'] =
        Math.round(totalEvents / nextCursor) > 1 ? nextCursor : undefined;

      return events;
    }

    return {
      data: [],
      nextCursor: 0,
    };
  }

  public async isEventsEmpty() {
    const results: DBEvent[] = await this.db.select(
      'SELECT * FROM events WHERE account_id = $1 ORDER BY id DESC LIMIT 1;',
      [this.account.id]
    );

    return results.length < 1;
  }

  public async getExplicitRelayUrls() {
    if (!this.account) return FULL_RELAYS;

    const result: Relays[] = await this.db.select(
      `SELECT * FROM relays WHERE account_id = "${this.account.id}" ORDER BY id DESC LIMIT 50;`
    );

    if (!result || !result.length) return FULL_RELAYS;
    return result.map((el) => el.relay);
  }

  public async createRelay(relay: string, purpose?: string) {
    const existRelays: Relays[] = await this.db.select(
      'SELECT * FROM relays WHERE relay = $1 AND account_id = $2 ORDER BY id DESC LIMIT 1;',
      [relay, this.account.id]
    );

    if (existRelays.length > 0) return false;

    return await this.db.execute(
      'INSERT OR IGNORE INTO relays (account_id, relay, purpose) VALUES ($1, $2, $3);',
      [this.account.id, relay, purpose || '']
    );
  }

  public async removeRelay(relay: string) {
    return await this.db.execute(`DELETE FROM relays WHERE relay = "${relay}";`);
  }

  public async createSetting(key: string, value: string) {
    const currentSetting = await this.getSettingValue(key);

    if (!currentSetting)
      return await this.db.execute(
        'INSERT OR IGNORE INTO settings (key, value) VALUES ($1, $2);',
        [key, value]
      );

    const currentValue = !!parseInt(currentSetting);

    return await this.db.execute('UPDATE settings SET value = $1 WHERE key = $2;', [
      +!currentValue,
      key,
    ]);
  }

  public async getAllSettings() {
    const results: { key: string; value: string }[] = await this.db.select(
      'SELECT * FROM settings ORDER BY id DESC;'
    );
    if (results.length < 1) return null;
    return results;
  }

  public async getSettingValue(key: string) {
    const results: { key: string; value: string }[] = await this.db.select(
      'SELECT * FROM settings WHERE key = $1 ORDER BY id DESC LIMIT 1;',
      [key]
    );
    if (results.length < 1) return null;
    return results[0].value;
  }

  public async clearCache() {
    await this.db.execute('DELETE FROM ndk_events;');
    await this.db.execute('DELETE FROM ndk_eventtags;');
    await this.db.execute('DELETE FROM ndk_users;');
  }

  public async accountLogout() {
    // update current account status
    await this.db.execute("UPDATE accounts SET is_active = '0' WHERE id = $1;", [
      this.account.id,
    ]);

    this.account = null;
    return true;
  }

  public async close() {
    return this.db.close();
  }
}
