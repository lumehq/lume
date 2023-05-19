import AppHeader from "@shared/appHeader";
import MultiAccounts from "@shared/multiAccounts";
import Navigation from "@shared/navigation";

export function LayoutChat({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-screen w-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white">
			<div className="flex h-screen w-full flex-col">
				<div
					data-tauri-drag-region
					className="relative h-9 shrink-0 border-b border-zinc-100 bg-white dark:border-zinc-900 dark:bg-black"
				>
					<AppHeader />
				</div>
				<div className="relative flex min-h-0 w-full flex-1">
					<div className="relative flex flex-row flex-wrap shrink-0">
						<MultiAccounts />
						<Navigation />
					</div>
					<div className="w-full h-full">{children}</div>
				</div>
			</div>
		</div>
	);
}
