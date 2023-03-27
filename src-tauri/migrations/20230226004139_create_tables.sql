-- Add migration script here
-- create relays
CREATE TABLE
  relays (
    id INTEGER PRIMARY KEY,
    relay_url TEXT NOT NULL,
    relay_status INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

-- add default relays
-- relay status:
-- 0: off
-- 1: on
INSERT INTO
  relays (relay_url, relay_status)
VALUES
  ("wss://relay.damus.io", "1"),
  ("wss://eden.nostr.land", "1"),
  ("wss://nostr-pub.wellorder.net", "1"),
  ("wss://nostr.bongbong.com", "1"),
  ("wss://nostr.zebedee.cloud", "1"),
  ("wss://nostr.fmt.wiz.biz", "1"),
  ("wss://nostr.walletofsatoshi.com", "1"),
  ("wss://relay.snort.social", "1"),
  ("wss://offchain.pub", "1"),
  ("wss://brb.io", "1"),
  ("wss://relay.current.fyi", "1"),
  ("wss://nostr.relayer.se", "1"),
  ("wss://nostr.bitcoiner.social", "1"),
  ("wss://relay.nostr.info", "1"),
  ("wss://relay.zeh.app", "1"),
  ("wss://nostr-01.dorafactory.org", "1"),
  ("wss://nostr.zhongwen.world", "1"),
  ("wss://nostro.cc", "1"),
  ("wss://relay.nostr.net.in", "1"),
  ("wss://nos.lol", "1");

-- create accounts
-- is_active (part of multi-account feature):
-- 0: false
-- 1: true
CREATE TABLE
  accounts (
    id TEXT PRIMARY KEY,
    privkey TEXT NOT NULL,
    npub TEXT NOT NULL,
    nsec TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 0,
    metadata TEXT
  );

-- create follows
-- kind (part of multi-newsfeed feature):
-- 0: direct
-- 1: follow of follow
CREATE TABLE
  follows (
    id INTEGER PRIMARY KEY,
    pubkey TEXT NOT NULL,
    account TEXT NOT NULL,
    kind INTEGER NOT NULL DEFAULT 0,
    metadata TEXT
  );

-- create index for pubkey in follows
CREATE UNIQUE INDEX index_pubkey_on_follows ON follows (pubkey);

-- create cache profiles
CREATE TABLE
  cache_profiles (
    id TEXT PRIMARY KEY,
    metadata TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

-- create cache notes
CREATE TABLE
  cache_notes (
    id TEXT PRIMARY KEY,
    pubkey TEXT NOT NULL,
    created_at TEXT,
    kind INTEGER NOT NULL DEFAULT 1,
    tags TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_id TEXT,
    parent_comment_id TEXT
  );

-- create settings
CREATE TABLE
  settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT NOT NULL,
    setting_value TEXT NOT NULL
  );

-- add default setting
INSERT INTO
  settings (setting_key, setting_value)
VALUES
  ("last_login", "0");