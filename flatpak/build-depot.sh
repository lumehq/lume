#!/usr/bin/env sh

directory_bin="/lume/src-tauri/bin"
target="x86_64-unknown-linux-gnu"

cd modules/depot

check_directory_keep=$(ls $directory_bin | grep -vE '.keep$' | wc -l)

echo $(ls $directory_bin | grep -vE '.keep$')

if [ $check_directory_keep -eq 0 ]; then
  cargo build --release
  mv target/release/depot "$directory_bin/depot-$target"
fi
