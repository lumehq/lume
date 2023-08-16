import { BaseDirectory, removeFile } from '@tauri-apps/plugin-fs';
import Database from '@tauri-apps/plugin-sql';
import { Stronghold } from '@tauri-apps/plugin-stronghold';

import { Account, LumeEvent, Relays, Widget } from '@utils/types';

export class LumeStorage {
  public db: Database;
  public secureDB: Stronghold;
  public account: Account | null = null;

  constructor(sqlite: Database, stronghold?: Stronghold) {
    this.db = sqlite;
    this.secureDB = stronghold ?? undefined;
    this.account = null;
  }

  private async getSecureClient() {
    try {
      return await this.secureDB.loadClient('lume');
    } catch {
      return await this.secureDB.createClient('lume');
    }
  }

  public async secureSave(key: string, value: string) {
    if (!this.secureDB) throw new Error("Stronghold isn't initialize");

    const client = await this.getSecureClient();
    const store = client.getStore();
    await store.insert(key, Array.from(new TextEncoder().encode(value)));
    return await this.secureDB.save();
  }

  public async secureLoad(key: string) {
    if (!this.secureDB) throw new Error("Stronghold isn't initialize");

    const client = await this.getSecureClient();
    const store = client.getStore();
    const value = await store.get(key);
    const decoded = new TextDecoder().decode(new Uint8Array(value));
    return decoded;
  }

  public async secureReset() {
    return await removeFile('lume.stronghold', { dir: BaseDirectory.AppConfig });
  }

  public async getActiveAccount() {
    const results: Array<Account> = await this.db.select(
      'SELECT * FROM accounts WHERE is_active = "1" ORDER BY id DESC LIMIT 1;'
    );

    if (results.length > 0) {
      const account = results[0];

      if (typeof account.follows === 'string')
        account.follows = JSON.parse(account.follows);

      if (typeof account.network === 'string')
        account.network = JSON.parse(account.network);

      this.account = account;
      return account;
    } else {
      console.log('no active account, please create new account');
      return null;
    }
  }

  public async createAccount(npub: string, pubkey: string) {
    const res = await this.db.execute(
      'INSERT OR IGNORE INTO accounts (npub, pubkey, privkey, is_active) VALUES ($1, $2, $3, $4);',
      [npub, pubkey, 'privkey is stored in secure storage', 1]
    );
    if (res) {
      const account = await this.getActiveAccount();
      return account;
    } else {
      console.error('create account failed');
    }
  }

  public async updateAccount(column: string, value: string | string[]) {
    const insert = await this.db.execute(
      `UPDATE accounts SET ${column} = $1 WHERE id = $2;`,
      [value, this.account.id]
    );

    if (insert) {
      const account = await this.getActiveAccount();
      return account;
    }
  }

  public async getWidgets() {
    const result: Array<Widget> = await this.db.select(
      `SELECT * FROM widgets WHERE account_id = "${this.account.id}" ORDER BY created_at DESC;`
    );
    return result;
  }

  public async createWidget(kind: number, title: string, content: string | string[]) {
    const insert = await this.db.execute(
      'INSERT OR IGNORE INTO widgets (account_id, kind, title, content) VALUES ($1, $2, $3, $4);',
      [this.account.id, kind, title, content]
    );

    if (insert) {
      const widget: Widget = await this.db.select(
        'SELECT * FROM widgets ORDER BY id DESC LIMIT 1;'
      )?.[0];
      if (!widget) console.error('get created widget failed');
      return widget;
    } else {
      console.error('create widget failed');
    }
  }

  public async removeWidget(id: string) {
    return await this.db.execute('DELETE FROM widgets WHERE id = $1;', [id]);
  }

  public async createEvent(
    cacheKey: string,
    event_id: string,
    event_kind: number,
    event: string
  ) {
    return await this.db.execute(
      'INSERT OR IGNORE INTO events (cache_key, event_id, event_kind, event) VALUES ($1, $2, $3, $4);',
      [cacheKey, event_id, event_kind, event]
    );
  }

  public async getALlEventByKey(cacheKey: string) {
    const events: LumeEvent[] = await this.db.select(
      'SELECT * FROM events WHERE cache_key = $1 ORDER BY id DESC;',
      [cacheKey]
    );

    if (events.length < 1) return null;
    return events;
  }

  public async getEventByID(id: string) {
    const event = await this.db.select(
      'SELECT * FROM events WHERE event_id = $1 ORDER BY id DESC LIMIT 1;',
      [id]
    )?.[0];

    if (!event) return null;
    return event;
  }

  public async getExplicitRelayUrls() {
    if (!this.account) return null;

    const result: Relays[] = await this.db.select(
      `SELECT * FROM relays WHERE account_id = "${this.account.id}" ORDER BY id DESC LIMIT 50;`
    );

    if (result.length < 1) return null;
    return result.map((el) => el.relay);
  }

  public async createRelay(relay: string, purpose?: string) {
    return await this.db.execute(
      'INSERT OR IGNORE INTO relays (account_id, relay, purpose) VALUES ($1, $2, $3);',
      [this.account.id, relay, purpose || '']
    );
  }

  public async removeRelay(relay: string) {
    return await this.db.execute(`DELETE FROM relays WHERE relay = "${relay}";`);
  }

  public async updateLastLogin(time: number) {
    return await this.db.execute(
      'UPDATE settings SET value = $1 WHERE key = "last_login";',
      [time]
    );
  }

  public async removePrivkey() {
    return await this.db.execute(
      `UPDATE accounts SET privkey = "privkey is stored in secure storage" WHERE id = "${this.account.id}";`
    );
  }

  public async close() {
    return this.db.close();
  }
}
