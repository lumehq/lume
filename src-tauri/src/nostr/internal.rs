use crate::Settings;
use nostr_sdk::prelude::*;

pub async fn init_nip65(client: &Client) {
    let signer = match client.signer().await {
        Ok(signer) => signer,
        Err(e) => {
            eprintln!("Failed to get signer: {:?}", e);
            return;
        }
    };
    let public_key = match signer.public_key().await {
        Ok(public_key) => public_key,
        Err(e) => {
            eprintln!("Failed to get public key: {:?}", e);
            return;
        }
    };

    let filter = Filter::new()
        .author(public_key)
        .kind(Kind::RelayList)
        .limit(1);

    if let Ok(events) = client.get_events_of(vec![filter], None).await {
        if let Some(event) = events.first() {
            let relay_list = nip65::extract_relay_list(event);
            for (url, metadata) in relay_list {
                let opts = match metadata {
                    Some(RelayMetadata::Read) => RelayOptions::new().read(true).write(false),
                    Some(_) => RelayOptions::new().write(true).read(false),
                    None => RelayOptions::default(),
                };
                if let Err(e) = client.add_relay_with_opts(&url.to_string(), opts).await {
                    eprintln!("Failed to add relay {}: {:?}", url, e);
                }
                if let Err(e) = client.connect_relay(url.to_string()).await {
                    eprintln!("Failed to connect to relay {}: {:?}", url, e);
                } else {
                    println!("Connecting to relay: {} - {:?}", url, metadata);
                }
            }
        }
    } else {
        eprintln!("Failed to get events for RelayList.");
    }
}

pub async fn get_user_settings(client: &Client) -> Result<Settings, String> {
    let ident = "lume:settings";
    let signer = client
        .signer()
        .await
        .map_err(|e| format!("Failed to get signer: {:?}", e))?;
    let public_key = signer
        .public_key()
        .await
        .map_err(|e| format!("Failed to get public key: {:?}", e))?;

    let filter = Filter::new()
        .author(public_key)
        .kind(Kind::ApplicationSpecificData)
        .identifier(ident)
        .limit(1);

    match client.get_events_of(vec![filter], None).await {
        Ok(events) => {
            if let Some(event) = events.first() {
                let content = event.content();
                match signer.nip44_decrypt(public_key, content).await {
                    Ok(decrypted) => match serde_json::from_str(&decrypted) {
                        Ok(parsed) => Ok(parsed),
                        Err(_) => Err("Could not parse settings payload".into()),
                    },
                    Err(e) => Err(format!("Failed to decrypt settings content: {:?}", e)),
                }
            } else {
                Err("Settings not found.".into())
            }
        }
        Err(e) => Err(format!(
            "Failed to get events for ApplicationSpecificData: {:?}",
            e
        )),
    }
}
