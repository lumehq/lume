_Note_: Lume is under rewrite to using Rust Nostr as back-end and more lightweight front-end. If you need stable version, you can download v3 and below.

--

## Introduction

Lume is a Nostr client for desktop include Linux, Windows and macOS. It is free and open source, you can look at source code on Github. Lume is actively improving the app and adding new features, you can expect new update every month.

## Usage

Download Lume v3 (v3.0.1-stable) for your platform here: [https://github.com/lumehq/lume/releases](https://github.com/lumehq/lume/releases)

Supported platform: macOS, Windows and Linux

## Prerequisites

- Node.js >= 18: https://nodejs.org/en

- Rust: https://rustup.rs/

- PNPM: https://pnpm.io

- Tauri v2: https://beta.tauri.app/guides/prerequisites/

## Develop

Clone project

```
git clone https://github.com/lumehq/lume.git && cd lume
```

Install packages

```
pnpm install
```

Run dev build

```
pnpm tauri dev
```

Generate production build

```
pnpm tauri build
```

## Nix

Requirements:

1. [Install Nix](https://zero-to-flakes.com/install)
1. [Setup `direnv`](https://zero-to-flakes.com/direnv)

`cd` into the root folder of the project to enter `nix develop` shell. Run `direnv allow` (only once). Then run `pnpm` or `bun` (experimental) commands as described above.

## License

Copyright (C) 2023-2024 Ren Amamiya & other Lume contributors (see AUTHORS.md)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see https://www.gnu.org/licenses/.
