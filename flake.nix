# Nix.flake to build Lume
# 
# It follows guidelines of Taiuri's Guides: 
# Prerequisites -> Installing -> Setting Up Linux -> NixOS
# https://tauri.app/v1/guides/getting-started/prerequisites/#1-system-dependencie 
#
# To build Rust backend of Tauri `rust-overlay` is used
# https://github.com/oxalica/rust-overlay

{
  inputs = {
    # nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.05";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay.url = "github:oxalica/rust-overlay";
  };

  outputs = { self, nixpkgs, flake-utils, rust-overlay }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs {
          inherit system overlays;
        };

        libraries = with pkgs;[
          webkitgtk
          gtk3
          cairo
          gdk-pixbuf
          glib
          dbus
          openssl_3
          librsvg     
        ];

        packages = with pkgs; [
          curl
          wget
          pkg-config
          dbus
          openssl_3
          glib
          gtk3
          libsoup
          webkitgtk
          librsvg
        ];

        rustToolchain = pkgs.rust-bin.stable.latest.default.override {
          extensions = [ "rust-src" ]; # needed by rust-analyzer
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            rustToolchain
            pkgs.nodejs
            pkgs.nodePackages.pnpm
            pkgs.bun # experimental in lume
          ] ++ packages;

          shellHook =
            ''
              export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath libraries}:$LD_LIBRARY_PATH
              export XDG_DATA_DIRS=${pkgs.gsettings-desktop-schemas}/share/gsettings-schemas/${pkgs.gsettings-desktop-schemas.name}:${pkgs.gtk3}/share/gsettings-schemas/${pkgs.gtk3.name}:$XDG_DATA_DIRS
            '';

          # Avoid white screen running with Nix
          # https://github.com/tauri-apps/tauri/issues/4315#issuecomment-1207755694
          WEBKIT_DISABLE_COMPOSITING_MODE = 1;
        };
      });
}
