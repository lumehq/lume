import { Navigation } from "@shared/navigation";
import { Outlet, ScrollRestoration } from "react-router-dom";

export function AppLayout() {
	return (
		<div className="flex w-screen h-screen">
			<div className="relative flex flex-row shrink-0">
				<Navigation />
			</div>
			<div className="w-full h-full">
				<Outlet />
				<ScrollRestoration />
			</div>
		</div>
	);
}
