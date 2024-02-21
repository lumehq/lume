### Introduction

Lume is a nostr client

### Usage

Download Lume for your platform here: [https://github.com/lumehq/lume/releases](https://github.com/lumehq/lume/releases)

Supported platform: macOS, Windows and Linux

### Prerequisites

- PNPM or Bun (experiment)

- Tauri: https://tauri.app/v1/guides/getting-started/prerequisites#setting-up-macos

### Develop

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

#### Nix 

Requirements:

1. [Install Nix](https://zero-to-flakes.com/install)
1. [Setup `direnv`](https://zero-to-flakes.com/direnv)

`cd` into the root folder of the project to enter `nix develop` shell. Run `direnv allow` (only once). Then run `pnpm` or `bun` (experimental) commands as described above.

## License

Copyright (C) 2023-2024 Ren Amamiya & other Lume contributors (see AUTHORS.md)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see https://www.gnu.org/licenses/.
