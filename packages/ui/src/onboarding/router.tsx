import { AnimatePresence } from "framer-motion";
import {
	MemoryRouter,
	Route,
	Routes,
	UNSAFE_LocationContext,
} from "react-router-dom";
import { OnboardingFinishScreen } from "./finish";
import { OnboardingFollowScreen } from "./follow";
import { OnboardingHomeScreen } from "./home";
import { OnboardingProfileSettingsScreen } from "./profileSettings";

export function OnboardingRouter() {
	return (
		<UNSAFE_LocationContext.Provider value={null}>
			<MemoryRouter future={{ v7_startTransition: true }}>
				<AnimatePresence>
					<Routes>
						<Route path="/" element={<OnboardingHomeScreen />} />
						<Route
							path="/profile-settings"
							element={<OnboardingProfileSettingsScreen />}
						/>
						<Route path="/follow" element={<OnboardingFollowScreen />} />
						<Route path="/finish" element={<OnboardingFinishScreen />} />
					</Routes>
				</AnimatePresence>
			</MemoryRouter>
		</UNSAFE_LocationContext.Provider>
	);
}
