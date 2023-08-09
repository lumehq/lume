import { readBinaryFile } from '@tauri-apps/plugin-fs';

export async function createBlobFromFile(path: string): Promise<Blob> {
  const file = await readBinaryFile(path);
  return new Blob([file]);
}
