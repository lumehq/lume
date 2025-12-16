use nostr_sdk::prelude::*;

pub fn shorten_pubkey(public_key: PublicKey, len: usize) -> String {
    let Ok(pubkey) = public_key.to_bech32();

    format!(
        "{}:{}",
        &pubkey[0..(len + 1)],
        &pubkey[pubkey.len() - len..]
    )
}
