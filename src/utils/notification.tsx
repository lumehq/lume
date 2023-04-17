import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';

export async function sendNativeNotification(content: string) {
  let permissionGranted = await isPermissionGranted();
  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === 'granted';
  }
  if (permissionGranted) {
    sendNotification({ title: 'TAURI', body: content });
  }
}
