import { readBinaryFile } from '@tauri-apps/api/fs';

export async function createBlobFromFile(path: string): Promise<Uint8Array> {
  const file = await readBinaryFile(path);
  const blob = new Blob([file]);
  const arr = new Uint8Array(await blob.arrayBuffer());
  return arr;
}
