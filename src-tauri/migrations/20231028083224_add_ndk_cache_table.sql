-- Add migration script here
CREATE TABLE
  ndk_users (
    pubkey TEXT NOT NULL PRIMARY KEY,
    profile TEXT,
    createdAt NUMBER
  );

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

CREATE TABLE
  ndk_eventtags (
    id TEXT NOT NULL PRIMARY KEY,
    eventId TEXT,
    tag TEXT,
    value TEXT,
    tagValue TEXT
  );
