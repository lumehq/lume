import { AnimatePresence } from "framer-motion";
import {
	MemoryRouter,
	Route,
	Routes,
	UNSAFE_LocationContext,
} from "react-router-dom";
import { TutorialFinishScreen } from "./finish";
import { TutorialManageColumnScreen } from "./manageColumn";
import { TutorialNewColumnScreen } from "./newColumn";
import { TutorialWelcomeScreen } from "./welcome";

export function TutorialRouter() {
	return (
		<UNSAFE_LocationContext.Provider value={null}>
			<MemoryRouter future={{ v7_startTransition: true }}>
				<AnimatePresence>
					<Routes>
						<Route path="/" element={<TutorialWelcomeScreen />} />
						<Route path="/new-column" element={<TutorialNewColumnScreen />} />
						<Route
							path="/manage-column"
							element={<TutorialManageColumnScreen />}
						/>
						<Route path="/finish" element={<TutorialFinishScreen />} />
					</Routes>
				</AnimatePresence>
			</MemoryRouter>
		</UNSAFE_LocationContext.Provider>
	);
}
