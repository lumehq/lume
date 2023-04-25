-- Add migration script here
-- add pubkey to channel
ALTER TABLE channels ADD pubkey TEXT NOT NULL DEFAULT '';