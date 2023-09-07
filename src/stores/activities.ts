import { NDKEvent } from '@nostr-dev-kit/ndk';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ActivitiesState {
  activities: null | Array<NDKEvent>;
  setActivities: (events: NDKEvent[]) => void;
  addActivity: (event: NDKEvent) => void;
}

export const useActivities = create<ActivitiesState>()(
  persist(
    (set) => ({
      activities: null,
      setActivities: (events: NDKEvent[]) => {
        set(() => ({ activities: events }));
      },
      addActivity: (event: NDKEvent) => {
        set((state) => ({ activities: [event, ...state.activities] }));
      },
    }),
    {
      name: 'activities',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
