import { BaseDirectory, removeFile } from '@tauri-apps/plugin-fs';
import Database from '@tauri-apps/plugin-sql';
import { Stronghold } from '@tauri-apps/plugin-stronghold';

import { Account, Relays, Widget } from '@utils/types';

export class LumeStorage {
  public db: Database;
  public secureDB: Stronghold;

  constructor(sqlite: Database, stronghold?: Stronghold) {
    this.db = sqlite;
    this.secureDB = stronghold ?? undefined;
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
    const account: Account = await this.db.select(
      'SELECT * FROM accounts WHERE is_active = 1;'
    )?.[0];
    if (account) {
      if (typeof account.follows === 'string')
        account.follows = JSON.parse(account.follows);

      if (typeof account.network === 'string')
        account.network = JSON.parse(account.network);

      return account;
    } else {
      throw new Error('Account not found');
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
    const account = await this.getActiveAccount();
    return await this.db.execute(`UPDATE accounts SET ${column} = $1 WHERE id = $2;`, [
      value,
      account.id,
    ]);
  }

  public async getWidgets() {
    const account = await this.getActiveAccount();
    const result: Array<Widget> = await this.db.select(
      `SELECT * FROM widgets WHERE account_id = "${account.id}" ORDER BY created_at DESC;`
    );
    return result;
  }

  public async createWidget(kind: number, title: string, content: string | string[]) {
    const account = await this.getActiveAccount();
    const insert = await this.db.execute(
      'INSERT OR IGNORE INTO widgets (account_id, kind, title, content) VALUES ($1, $2, $3, $4);',
      [account.id, kind, title, content]
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

  public async getEventByKey(cacheKey: string) {
    const event = await this.db.select(
      'SELECT * FROM events WHERE cache_key = $1 ORDER BY id DESC LIMIT 1;',
      [cacheKey]
    )?.[0];
    if (!event) {
      console.error('failed to get event by cache_key: ', cacheKey);
      return null;
    }
    return event;
  }

  public async getEventByID(id: string) {
    const event = await this.db.select(
      'SELECT * FROM events WHERE event_id = $1 ORDER BY id DESC LIMIT 1;',
      [id]
    )?.[0];
    if (!event) {
      console.error('failed to get event by id: ', id);
      return null;
    }
    return event;
  }

  public async getExplicitRelayUrls() {
    const account = await this.getActiveAccount();
    const result: Relays[] = await this.db.select(
      `SELECT * FROM relays WHERE account_id = "${account.id}";`
    );

    if (result.length > 0) return result.map((el) => el.relay);
    return null;
  }

  public async createRelay(relay: string, purpose?: string) {
    const account = await this.getActiveAccount();
    return await this.db.execute(
      'INSERT OR IGNORE INTO relays (account_id, relay, purpose) VALUES ($1, $2, $3);',
      [account.id, relay, purpose || '']
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

  public async close() {
    return this.db.close();
  }
}
