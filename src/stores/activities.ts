import { NDKEvent } from '@nostr-dev-kit/ndk';
import { create } from 'zustand';

interface ActivitiesState {
  activities: Array<NDKEvent>;
  setActivities: (events: NDKEvent[]) => void;
  addActivity: (event: NDKEvent) => void;
}

export const useActivities = create<ActivitiesState>((set) => ({
  activities: null,
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
}));
