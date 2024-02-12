import { Navigation } from "@lume/ui";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
	component: App,
});

function App() {
	return (
		<div className="flex flex-col w-screen h-screen bg-gradient-to-tl from-gray-1 to-gray-2 dark:from-graydark-1 dark:to-graydark-2">
			<div data-tauri-drag-region className="h-9 shrink-0" />
			<div className="flex w-full h-full min-h-0">
				<Navigation />
				<div className="flex-1 h-full pb-2 pl-1 pr-2">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
