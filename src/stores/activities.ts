import { NDKEvent } from '@nostr-dev-kit/ndk';
import { create } from 'zustand';

interface ActivitiesState {
  activities: Array<NDKEvent>;
  totalNewActivities: number;
  setActivities: (events: NDKEvent[]) => void;
  addActivity: (event: NDKEvent) => void;
  clearTotalNewActivities: () => void;
}

export const useActivities = create<ActivitiesState>((set) => ({
  activities: null,
  totalNewActivities: 0,
  setActivities: (events: NDKEvent[]) => {
    set(() => ({ activities: events }));
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
