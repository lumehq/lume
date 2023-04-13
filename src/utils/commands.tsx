import { invoke } from '@tauri-apps/api';

export function countTotalNotes() {
  return invoke('count_total_notes');
}

export function countTotalChannels() {
  return invoke('count_total_channels');
}

export function countTotalChats() {
  return invoke('count_total_chats');
}
