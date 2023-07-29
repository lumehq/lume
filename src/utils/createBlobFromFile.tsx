import { readBinaryFile } from '@tauri-apps/plugin-fs';

export async function createBlobFromFile(path: string): Promise<Uint8Array> {
  const file = await readBinaryFile(path);
  return file;
}
