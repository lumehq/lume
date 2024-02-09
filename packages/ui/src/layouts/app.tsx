import { Outlet } from "react-router-dom";
import { Editor } from "../editor/column";
import { Navigation } from "../navigation";
import { SearchDialog } from "../search/dialog";

export function AppLayout() {
	return (
		<div className="flex h-screen w-screen flex-col bg-gradient-to-tl from-neutral-50 to-neutral-200 dark:from-neutral-950 dark:to-neutral-800">
			<div data-tauri-drag-region className="h-9 shrink-0" />
			<div className="flex w-full h-full min-h-0">
				<Navigation />
				<Editor />
				<SearchDialog />
				<div className="flex-1 h-full px-1 pb-1">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
