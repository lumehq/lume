-- create accounts table
CREATE TABLE
  accounts (
    id INTEGER NOT NULL PRIMARY KEY,
    pubkey TEXT NOT NULL UNIQUE,
    is_active INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

-- create ndk cache users table
CREATE TABLE
  ndk_users (
    pubkey TEXT NOT NULL PRIMARY KEY,
    profile TEXT,
    createdAt NUMBER
  );

-- create ndk cache events table
CREATE TABLE
  ndk_events (
    id TEXT NOT NULL PRIMARY KEY,
    pubkey TEXT,
    content TEXT,
    kind NUMBER,
    createdAt NUMBER,
    relay TEXT,
    event TEXT
  );

-- create ndk cache eventtags table
CREATE TABLE
  ndk_eventtags (
    id TEXT NOT NULL PRIMARY KEY,
    eventId TEXT,
    tag TEXT,
    value TEXT,
    tagValue TEXT
  );

-- create settings table
CREATE TABLE
  settings (
    id INTEGER NOT NULL PRIMARY KEY,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

-- create columns table
CREATE TABLE
  columns (
    id INTEGER NOT NULL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    kind INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts (id)
  );
