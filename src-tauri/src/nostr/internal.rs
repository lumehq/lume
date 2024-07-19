use crate::Settings;
use nostr_sdk::prelude::*;

pub async fn init_nip65(client: &Client) {
    let signer = client.signer().await.unwrap();
    let public_key = signer.public_key().await.unwrap();

    if let Ok(events) = client
        .get_events_of(
            vec![Filter::new()
                .author(public_key)
                .kind(Kind::RelayList)
                .limit(1)],
            None,
        )
        .await
    {
        if let Some(event) = events.first() {
            let relay_list = nip65::extract_relay_list(event);
            for item in relay_list.into_iter() {
                let relay_url = item.0.to_string();
                let opts = match item.1 {
                    Some(val) => {
                        if val == &RelayMetadata::Read {
                            RelayOptions::new().read(true).write(false)
                        } else {
                            RelayOptions::new().write(true).read(false)
                        }
                    }
                    None => RelayOptions::default(),
                };

                // Add relay to relay pool
                let _ = client
                    .add_relay_with_opts(&relay_url, opts)
                    .await
                    .unwrap_or_default();

                // Connect relay
                client.connect_relay(relay_url).await.unwrap_or_default();
                println!("connecting to relay: {} - {:?}", item.0, item.1);
            }
        }
    };
}

pub async fn get_user_settings(client: &Client) -> Result<Settings, String> {
    let ident = "lume:settings";
    let signer = client.signer().await.unwrap();
    let public_key = signer.public_key().await.unwrap();

    let filter = Filter::new()
        .author(public_key)
        .kind(Kind::ApplicationSpecificData)
        .identifier(ident)
        .limit(1);

    if let Ok(events) = client.get_events_of(vec![filter], None).await {
        if let Some(event) = events.first() {
            let content = event.content();
            if let Ok(decrypted) = signer.nip44_decrypt(public_key, content).await {
                match serde_json::from_str(&decrypted) {
                    Ok(parsed) => parsed,
                    Err(_) => Err("Could not parse settings payload".into()),
                }
            } else {
                Err("Decrypt settings failed.".into())
            }
        } else {
            Err("Settings not found.".into())
        }
    } else {
        Err("Settings not found.".into())
    }
}
