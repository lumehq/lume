# Lume nostr desktop client
[GitHub - luminous-devs/lume: A cross-platform desktop nostr client](https://github.com/luminous-devs/lume) is made with Tauri and built using [pnpm](https://pnpm.io) and [cargo](https://doc.rust-lang.org/cargo/) packages.
Lume itself has node dependencies managed with pnpm as well.

## Source generation
To transform their package locks into flatpak sources, [flatpak-builder-tools](https://github.com/flatpak/flatpak-builder-tools) is used.

```sh
# Generate cinny-desktop sources for use with cargo
<path-to flatpak-builder-tools>/cargo/flatpak-cargo-generator.py -o cargo-sources.json <path-to cinny-desktop>/src-tauri/Cargo.lock

# Generate cinny and cinny-desktop sources for use with npm
flatpak-node-generator --no-requests-cache -r -o node-sources.json npm <path-to cinny-desktop>/package-lock.json
```
