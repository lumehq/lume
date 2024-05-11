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
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/settings")({
	component: Screen,
});

function Screen() {
	const { t } = useTranslation();

	return (
		<div className="flex h-full w-full flex-col">
			<div
				data-tauri-drag-region
				className="flex h-20 w-full shrink-0 items-center justify-center border-b border-black/10 dark:border-white/10"
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
									<p className="text-sm font-medium">
										{t("settings.general.title")}
									</p>
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
									<p className="text-sm font-medium">
										{t("settings.user.title")}
									</p>
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
					<Link to="/settings/zap">
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
									<p className="text-sm font-medium">
										{t("settings.zap.title")}
									</p>
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
									<p className="text-sm font-medium">
										{t("settings.backup.title")}
									</p>
								</div>
							);
						}}
					</Link>
				</div>
			</div>
			<div className="w-full flex-1 overflow-y-auto scrollbar-none px-5 py-4">
				<Outlet />
			</div>
		</div>
	);
}
