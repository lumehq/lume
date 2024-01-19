import { AnimatePresence } from "framer-motion";
import {
	MemoryRouter,
	Route,
	Routes,
	UNSAFE_LocationContext,
} from "react-router-dom";
import { OnboardingFinishScreen } from "./finish";
import { OnboardingHomeScreen } from "./home";
import { OnboardingInterestScreen } from "./interest";
import { OnboardingProfileScreen } from "./profile";

export function OnboardingRouter() {
	return (
		<UNSAFE_LocationContext.Provider value={null}>
			<MemoryRouter future={{ v7_startTransition: true }}>
				<AnimatePresence>
					<Routes>
						<Route path="/" element={<OnboardingHomeScreen />} />
						<Route path="/profile" element={<OnboardingProfileScreen />} />
						<Route path="/interests" element={<OnboardingInterestScreen />} />
						<Route path="/finish" element={<OnboardingFinishScreen />} />
					</Routes>
				</AnimatePresence>
			</MemoryRouter>
		</UNSAFE_LocationContext.Provider>
	);
}
