import {
	AdvancedSettingsIcon,
	InfoIcon,
	NwcIcon,
	SecureIcon,
	SettingsIcon,
	UserIcon,
} from "@lume/icons";
import { cn } from "@lume/utils";
import { NavLink, Outlet } from "react-router-dom";

export function SettingsLayout() {
	return (
		<div className="flex h-full min-h-0 w-full flex-col rounded-xl overflow-y-auto">
			<div className="flex h-24 shrink-0 w-full items-center justify-center px-2 bg-white/50 backdrop-blur-xl dark:bg-black/50">
				<div className="flex items-center gap-0.5">
					<NavLink
						end
						to="/settings/"
						className={({ isActive }) =>
							cn(
								"flex w-20 shrink-0 flex-col gap-1 items-center justify-center rounded-lg px-2 py-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900",
								isActive
									? "bg-black/10 dark:bg-white/10 text-blue-500 hover:bg-black/20 dark:hover:bg-white/20"
									: "",
							)
						}
					>
						<SettingsIcon className="size-6" />
						<p className="text-sm font-medium">General</p>
					</NavLink>
					<NavLink
						to="/settings/profile"
						end
						className={({ isActive }) =>
							cn(
								"flex w-20 shrink-0 flex-col gap-1 items-center justify-center rounded-lg px-2 py-2 text-neutral-700 hover:bg-black/10 dark:text-neutral-300 dark:hover:bg-white/10",
								isActive
									? "bg-black/10 dark:bg-white/10 text-blue-500 hover:bg-black/20 dark:hover:bg-white/20"
									: "",
							)
						}
					>
						<UserIcon className="size-6" />
						<p className="text-sm font-medium">User</p>
					</NavLink>
					<NavLink
						to="/settings/nwc"
						className={({ isActive }) =>
							cn(
								"flex w-20 shrink-0 flex-col gap-1 items-center justify-center rounded-lg px-2 py-2 text-neutral-700 hover:bg-black/10 dark:text-neutral-300 dark:hover:bg-white/10",
								isActive
									? "bg-black/10 dark:bg-white/10 text-blue-500 hover:bg-black/20 dark:hover:bg-white/20"
									: "",
							)
						}
					>
						<NwcIcon className="size-6" />
						<p className="text-sm font-medium">Wallet</p>
					</NavLink>
					<NavLink
						to="/settings/backup"
						className={({ isActive }) =>
							cn(
								"flex w-20 shrink-0 flex-col gap-1 items-center justify-center rounded-lg px-2 py-2 text-neutral-700 hover:bg-black/10 dark:text-neutral-300 dark:hover:bg-white/10",
								isActive
									? "bg-black/10 dark:bg-white/10 text-blue-500 hover:bg-black/20 dark:hover:bg-white/20"
									: "",
							)
						}
					>
						<SecureIcon className="size-6" />
						<p className="text-sm font-medium">Backup</p>
					</NavLink>
					<NavLink
						to="/settings/advanced"
						className={({ isActive }) =>
							cn(
								"flex w-20 shrink-0 flex-col gap-1 items-center justify-center rounded-lg px-2 py-2 text-neutral-700 hover:bg-black/10 dark:text-neutral-300 dark:hover:bg-white/10",
								isActive
									? "bg-black/10 dark:bg-white/10 text-blue-500 hover:bg-black/20 dark:hover:bg-white/20"
									: "",
							)
						}
					>
						<AdvancedSettingsIcon className="size-6" />
						<p className="text-sm font-medium">Advanced</p>
					</NavLink>
					<NavLink
						to="/settings/about"
						className={({ isActive }) =>
							cn(
								"flex w-20 shrink-0 flex-col gap-1 items-center justify-center rounded-lg px-2 py-2 text-neutral-700 hover:bg-black/10 dark:text-neutral-300 dark:hover:bg-white/10",
								isActive
									? "bg-black/10 dark:bg-white/10 text-blue-500 hover:bg-black/20 dark:hover:bg-white/20"
									: "",
							)
						}
					>
						<InfoIcon className="size-6" />
						<p className="text-sm font-medium">About</p>
					</NavLink>
				</div>
			</div>
			<div className="flex-1 py-6 min-h-0 overflow-y-auto bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:bg-black dark:shadow-none dark:ring-1 dark:ring-white/10">
				<Outlet />
			</div>
		</div>
	);
}
