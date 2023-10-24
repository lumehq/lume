### Introduction

Lume is a nostr client

### Usage

Download Lume for your platform here: [https://github.com/luminous-devs/lume/releases](https://github.com/luminous-devs/lume/releases)

Supported platform: macOS, Windows and Linux

### Prerequisites

- PNPM or Bun (experiment)

- Tauri: https://tauri.app/v1/guides/getting-started/prerequisites#setting-up-macos

### Develop

Clone project

```
git clone https://github.com/luminous-devs/lume.git && cd lume
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

By `cd` into the root folder of the project you will enter the `nix develop` shell. Run `direnv allow` (only once needed). Then just use run `pnpm` or `bun` (experimental) commands as descirbed above. 
