import { NDKEvent } from '@nostr-dev-kit/ndk';
import { create } from 'zustand';

interface ActivitiesState {
  activities: Array<NDKEvent>;
  newMessages: number;
  setActivities: (events: NDKEvent[]) => void;
  addActivity: (event: NDKEvent) => void;
  addNewMessage: () => void;
  clearNewMessage: () => void;
}

export const useActivities = create<ActivitiesState>((set) => ({
  activities: null,
  newMessages: 0,
  setActivities: (events: NDKEvent[]) => {
    set(() => ({
      activities: events,
    }));
  },
  addActivity: (event: NDKEvent) => {
    set((state) => ({
      activities: state.activities ? [event, ...state.activities] : [event],
    }));
  },
  addNewMessage: () => {
    set((state) => ({ newMessages: state.newMessages + 1 }));
  },
  clearNewMessage: () => {
    set(() => ({ newMessages: 0 }));
  },
}));
