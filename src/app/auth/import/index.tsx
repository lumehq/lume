import { Outlet } from "react-router-dom";

export function AuthImportScreen() {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<Outlet />
		</div>
	);
}
