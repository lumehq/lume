import { NDKEvent } from '@nostr-dev-kit/ndk';
import { create } from 'zustand';

interface ActivitiesState {
  activities: Array<NDKEvent>;
  totalNewActivities: number;
  setActivities: (events: NDKEvent[], lastLogin: number) => void;
  addActivity: (event: NDKEvent) => void;
  clearTotalNewActivities: () => void;
}

export const useActivities = create<ActivitiesState>((set) => ({
  activities: null,
  totalNewActivities: 0,
  setActivities: (events: NDKEvent[], lastLogin: number) => {
    const latest = events.filter((ev) => ev.created_at > lastLogin);
    set(() => ({
      activities: events,
      totalNewActivities: latest.length > 0 ? latest.length : 0,
    }));
  },
  addActivity: (event: NDKEvent) => {
    set((state) => ({
      activities: state.activities ? [event, ...state.activities] : [event],
      totalNewActivities: (state.totalNewActivities += 1),
    }));
  },
  clearTotalNewActivities: () => {
    set(() => ({ totalNewActivities: 0 }));
  },
}));
