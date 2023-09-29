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
    const totalLatest = events.filter((ev) => ev.created_at > lastLogin)?.length ?? 0;
    set(() => ({
      activities: events,
      totalNewActivities: totalLatest,
    }));
  },
  addActivity: (event: NDKEvent) => {
    set((state) => ({
      activities: state.activities ? [event, ...state.activities] : [event],
      totalNewActivities: state.totalNewActivities++,
    }));
  },
  clearTotalNewActivities: () => {
    set(() => ({ totalNewActivities: 0 }));
  },
}));
