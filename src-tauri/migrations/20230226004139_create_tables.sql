-- Add migration script here
-- create accounts
CREATE TABLE
  accounts (
    id TEXT PRIMARY KEY,
    privkey TEXT NOT NULL,
    npub TEXT NOT NULL,
    nsec TEXT NOT NULL,
    metadata JSON
  );

-- create follows
CREATE TABLE
  follows (
    id INTEGER PRIMARY KEY,
    pubkey TEXT NOT NULL,
    account TEXT NOT NULL,
    metadata JSON
  );

-- create index for pubkey in follows
CREATE UNIQUE INDEX index_pubkey ON follows (pubkey);

-- create cache profiles
CREATE TABLE
  cache_profiles (
    id TEXT PRIMARY KEY,
    metadata JSON,
    created_at TEXT,
    updated_at TEXT
  );

-- create cache notes
CREATE TABLE
  cache_notes (
    id TEXT PRIMARY KEY,
    note JSON,
    created_at TEXT,
    updated_at TEXT
  );