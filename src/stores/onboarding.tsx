import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useOnboarding = create(
	persist(
		(set) => ({
			profile: {},
			createProfile: (data) => {
				set({ profile: data });
			},
		}),
		{
			name: "onboarding",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
