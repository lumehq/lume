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
