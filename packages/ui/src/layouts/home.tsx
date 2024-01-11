import { Outlet } from "react-router-dom";
import { OnboardingModal } from "../onboarding/modal";

export function HomeLayout() {
	return (
		<>
			<OnboardingModal />
			<div className="h-full w-full rounded-xl overflow-hidden bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:bg-black dark:shadow-none dark:ring-1 dark:ring-white/10">
				<Outlet />
			</div>
		</>
	);
}
