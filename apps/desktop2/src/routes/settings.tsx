import {
	RelayIcon,
	SecureIcon,
	SettingsIcon,
	UserIcon,
	ZapIcon,
} from "@lume/icons";
import { cn } from "@lume/utils";
import { Link } from "@tanstack/react-router";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
	component: Screen,
});

function Screen() {
	return (
		<div className="flex flex-col w-full h-full">
			<div
				data-tauri-drag-region
				className="flex items-center justify-center w-full h-20 border-b shrink-0 border-black/10 dark:border-white/10"
			>
				<div className="flex items-center gap-1">
					<Link to="/settings/general">
						{({ isActive }) => {
							return (
								<div
									className={cn(
										"flex h-14 w-20 shrink-0 flex-col items-center justify-center rounded-lg p-2",
										isActive
											? "bg-black/10 hover:bg-black/20 dark:bg-white/10 text-neutral-900 dark:text-neutral-100 dark:hover:bg-bg-white/20"
											: "text-neutral-700 hover:bg-black/10 dark:text-neutral-300 dark:hover:bg-white/10",
									)}
								>
									<SettingsIcon className="size-5 shrink-0" />
									<p className="text-sm font-medium">General</p>
								</div>
							);
						}}
					</Link>
					<Link to="/settings/user">
						{({ isActive }) => {
							return (
								<div
									className={cn(
										"flex h-14 w-20 shrink-0 flex-col items-center justify-center rounded-lg p-2",
										isActive
											? "bg-black/10 hover:bg-black/20 dark:bg-white/10 text-neutral-900 dark:text-neutral-100 dark:hover:bg-bg-white/20"
											: "text-neutral-700 hover:bg-black/10 dark:text-neutral-300 dark:hover:bg-white/10",
									)}
								>
									<UserIcon className="size-5 shrink-0" />
									<p className="text-sm font-medium">User</p>
								</div>
							);
						}}
					</Link>
					<Link to="/settings/relay">
						{({ isActive }) => {
							return (
								<div
									className={cn(
										"flex h-14 w-20 shrink-0 flex-col items-center justify-center rounded-lg p-2",
										isActive
											? "bg-black/10 hover:bg-black/20 dark:bg-white/10 text-neutral-900 dark:text-neutral-100 dark:hover:bg-bg-white/20"
											: "text-neutral-700 hover:bg-black/10 dark:text-neutral-300 dark:hover:bg-white/10",
									)}
								>
									<RelayIcon className="size-5 shrink-0" />
									<p className="text-sm font-medium">Relay</p>
								</div>
							);
						}}
					</Link>
					<Link to="/settings/wallet">
						{({ isActive }) => {
							return (
								<div
									className={cn(
										"flex h-14 w-20 shrink-0 flex-col items-center justify-center rounded-lg p-2",
										isActive
											? "bg-black/10 hover:bg-black/20 dark:bg-white/10 text-neutral-900 dark:text-neutral-100 dark:hover:bg-bg-white/20"
											: "text-neutral-700 hover:bg-black/10 dark:text-neutral-300 dark:hover:bg-white/10",
									)}
								>
									<ZapIcon className="size-5 shrink-0" />
									<p className="text-sm font-medium">Wallet</p>
								</div>
							);
						}}
					</Link>
					<Link to="/settings/backup">
						{({ isActive }) => {
							return (
								<div
									className={cn(
										"flex h-14 w-20 shrink-0 flex-col items-center justify-center rounded-lg p-2",
										isActive
											? "bg-black/10 hover:bg-black/20 dark:bg-white/10 text-neutral-900 dark:text-neutral-100 dark:hover:bg-bg-white/20"
											: "text-neutral-700 hover:bg-black/10 dark:text-neutral-300 dark:hover:bg-white/10",
									)}
								>
									<SecureIcon className="size-5 shrink-0" />
									<p className="text-sm font-medium">Backup</p>
								</div>
							);
						}}
					</Link>
				</div>
			</div>
			<div className="flex-1 w-full px-5 py-4 overflow-y-auto scrollbar-none">
				<Outlet />
			</div>
		</div>
	);
}
