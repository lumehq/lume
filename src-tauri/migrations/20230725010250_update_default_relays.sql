-- Add migration script here
UPDATE settings
SET
  value = '["wss://relayable.org","wss://relay.damus.io","wss://relay.nostr.band/all","wss://nostr.mutinywallet.com"]'
WHERE
  key = 'relays';