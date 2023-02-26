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
    kind INTEGER NOT NULL DEFAULT 0,
    metadata JSON
  );

-- create index for pubkey in follows
CREATE UNIQUE INDEX index_pubkey ON follows (pubkey);

-- create cache profiles
CREATE TABLE
  cache_profiles (
    id TEXT PRIMARY KEY,
    metadata JSON,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

-- create cache notes
CREATE TABLE
  cache_notes (
    id TEXT PRIMARY KEY,
    note JSON,
    kind INTEGER NOT NULL DEFAULT 1,
    is_multi BOOLEAN DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );