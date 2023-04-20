<p align="center">
  <a href="#">

  </a>
  <p align="center">
   <img width="150" height="150" src="https://bafybeiascaupgzgxuoercns33vhxhq7c6oibhvxnzenvurgsjdyr4jp3la.ipfs.w3s.link/macos-512.png" alt="Logo">
  </p>
  <h1 align="center"><b>Lume</b></h1>
  <p align="center">
    An ambitious nostr client
    <br />
    <a href="https://uselume.xyz"><strong>uselume.xyz »</strong></a>
    <br />
    <b>Download for </b>
    macOS
    ·
    Windows
    ·
    Linux
    <br />
    <i>~ Links will be added once a release is available. ~</i>
  </p>
</p>
Lume is an open source cross-platform Nostr client, powered by (<a href="https://tauri.app" target="_blank">Tauri</a>) and web-tech.
<br/>
<br/>

> NOTE: Lume is under active development, most of the listed features are still experimental and subject to change.

Nostr is truly censorship-resistant protocol for social network and messenger app, combine with Bitcoin, they are powerful tools bring you to freedom. Lume is one of many great clients to help you interact with them, built with Tauri and Web-tech aiming for speed and efficiency

Lume is simple as it is, no more buzzwords

<p align="center">
  <img src="https://void.cat/d/2oaFfzJsjnKNye6fHTpaq2" alt="App screenshot">
  <br />
  <br />
</p>

## How Nostr works?

Everybody runs a client. It can be a native client, a web client, etc. To publish something, you write a post, sign it with your key and send it to multiple relays (servers hosted by someone else, or yourself). To get updates from other people, you ask multiple relays if they know anything about these other people. Anyone can run a relay. A relay is very simple and dumb. It does nothing besides accepting posts from some people and forwarding to others. Relays don't have to be trusted. Signatures are verified on the client side. [Learn more](https://github.com/nostr-protocol/nostr)

## Motivation

When Nostr became popular, many clients exist but none of them satisfy me, so I built my own. I don't many experence in develop desktop app before, my background is just strongly in Ruby on Rails, this is also a good opportunity for me to improve my skills.

## Development

Prerequisites:

- Nodejs >= 18.0.0
- Install pnpm: [docs](https://pnpm.io/)
- Setup Tauri: [docs](https://tauri.app/v1/guides/getting-started/prerequisites)

Clone repo:

Note: always use `canary` branch for development

```
git clone -b canary https://github.com/luminous-devs/lume.git
```

Move to clone folder in previous step

```
cd lume/
```

Install dependencies

```
pnpm install
```

Run development build

```
pnpm tauri dev
```

First time launch app, Lume automatically create local database (sqlite) and run migrations, place at `src-tauri/migrations`

```
Database folder: tauri::api::path::BaseDirectory::App
MacOS: /Users/<username>/Library/Application Support/com.lume.nu/lume.db
```

In `splashscreen` page, Lume will check accounts table has any account or not. If not redirect to `/onboarding`. If present, run `subscribe` to fetch events from `DEFAULT_RELAYS`

In `/onboarding` page, user can import old `private key` or create new .If import old key, fetch `kind 0, 3` then insert to accounts table in database .If create new, show to user npub/nsec as well as random profile, then move to pre-follows page. Then redirect back to `splashscreen`

**About Lume event processing**

- Lume is using [nostr-relaypool-ts](https://github.com/adamritter/nostr-relaypool-ts) to interact with relays
- When user open app, if `total notes in db == 0`, splashscreen `src/app/page.tsx` will fetch all events from 24 hours ago, if above zero, it will fetch all events since `last time` logged
- When user using app, `event collector` component have role fetch all events since `current time` and save to `database`
- `event collector` also have role update `last time logged` to local storage when user close the app
- Newsfeed page `following or circle` will fetch event from `database` then render in `virtuaso` component
- Lume don't render event directly after get it from relays, event will be saved in database first, and fetch via `sql query`
