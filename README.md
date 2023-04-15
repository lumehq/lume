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

## Why desktop only?

Lume is "an ambitious nostr client", so I don't want to limit it be a part of your daily web browsing, I want it to be a part of your computer. With a desktop app, I can explore more potentials, and in my opinion, web is broken I don't want to focus on it anymore (I will share more about this opinion later)

## Features

**Current**: v0.2.5

- [x] create new key
- [x] import private key (hex/nsec)
- [x] followings newsfeed
- [x] handle note reaction
- [x] handle note repost
- [x] handle note have image/video
- [x] handle tags (#[x]) in note
- [x] handle reply note
- [x] publish a note (support markdown)
- [x] update profile
- [x] cache profile to local database
- [x] offline support
- [x] implement newsfeed infinite loading
- [x] personal profile page
- [x] windows & linux support

## Roadmap

View full roadmap for v0.3.0 [here](https://github.com/users/reyamir/projects/2)

## Running dev build

Prerequisites:

- Nodejs >= 18.0.0
- Install pnpm: [docs](https://pnpm.io/)
- Setup Tauri: [docs](https://tauri.app/v1/guides/getting-started/prerequisites)

Clone repo:

```
git clone https://github.com/reyamir/lume-desktop.git
```

Install dependencies

```
pnpm install
```

Generate prisma database

```
pnpm init-db
```

Run development window

```
pnpm tauri dev
```
