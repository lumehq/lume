-- Add migration script here
INSERT INTO
  settings (key, value)
VALUES
  ("last_login", "0"),
  (
    "relays",
    '["wss://relayable.org","wss://relay.damus.io","wss://relay.nostr.band/all","wss://relay.nostrgraph.net","wss://nostr.mutinywallet.com"]'
  ),
  ("auto_start", "0"),
  ("cache_time", "86400"),
  ("compose_shortcut", "meta+n"),
  ("add_imageblock_shortcut", "meta+i"),
  ("add_feedblock_shortcut", "meta+f")