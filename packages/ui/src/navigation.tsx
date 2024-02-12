import {
	ArrowUpSquareIcon,
	BellFilledIcon,
	BellIcon,
	HomeFilledIcon,
	HomeIcon,
	PlusIcon,
	SearchFilledIcon,
	SearchIcon,
	SettingsFilledIcon,
	SettingsIcon,
} from "@lume/icons";
import { cn, editorAtom, searchAtom } from "@lume/utils";
import { Link } from "@tanstack/react-router";
import { confirm } from "@tauri-apps/plugin-dialog";
import { relaunch } from "@tauri-apps/plugin-process";
import { Update, check } from "@tauri-apps/plugin-updater";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ActiveAccount } from "./account/active";
import { UnreadActivity } from "./unread";

export function Navigation() {
	const [isEditorOpen, setIsEditorOpen] = useAtom(editorAtom);
	const [search, setSearch] = useAtom(searchAtom);
	const [update, setUpdate] = useState<Update>(null);

	// shortcut for editor
	useHotkeys("meta+n", () => setIsEditorOpen((state) => !state), []);

	const installNewUpdate = async () => {
		if (!update) return;

		const yes = await confirm(update.body, {
			title: `v${update.version} is available`,
			type: "info",
		});

		if (yes) {
			await update.downloadAndInstall();
			await relaunch();
		}
	};

	useEffect(() => {
		async function checkNewUpdate() {
			const newVersion = await check();
			setUpdate(newVersion);
		}
		checkNewUpdate();
	}, []);

	return (
		<div
			data-tauri-drag-region
			className="flex flex-col justify-between w-20 h-full px-4 py-3 shrink-0"
		>
			<div className="flex flex-col flex-1">
				<div className="flex flex-col gap-3">
					<ActiveAccount />
					<button
						type="button"
						onClick={() => setIsEditorOpen((state) => !state)}
						className={cn(
							"flex items-center justify-center h-auto w-full aspect-square rounded-xl text-gray-normal",
							isEditorOpen
								? "bg-blue-solid text-white"
								: "bg-gray-4 hover:bg-blue-solid dark:bg-graydark-4",
						)}
					>
						<PlusIcon className="size-5" />
					</button>
				</div>
				<div className="w-2/3 h-px mx-auto my-5 bg-black/10 dark:bg-white/10" />
				<div className="flex flex-col gap-2">
					<Link
						to="/app/space"
						className="inline-flex flex-col items-center justify-center"
					>
						{({ isActive }) => (
							<div
								className={cn(
									"inline-flex aspect-square h-auto w-full items-center justify-center rounded-xl",
									isActive
										? "bg-black/10 text-black dark:bg-white/10 dark:text-white"
										: "text-black/50 dark:text-neutral-400",
								)}
							>
								{isActive ? (
									<HomeFilledIcon className="size-6" />
								) : (
									<HomeIcon className="size-6" />
								)}
							</div>
						)}
					</Link>
					<Link
						to="/app/activity"
						className="inline-flex flex-col items-center justify-center"
					>
						{({ isActive }) => (
							<div
								className={cn(
									"relative inline-flex aspect-square h-auto w-full items-center justify-center rounded-xl",
									isActive
										? "bg-black/10 text-black dark:bg-white/10 dark:text-white"
										: "text-black/50 dark:text-neutral-400",
								)}
							>
								{isActive ? (
									<BellFilledIcon className="size-6" />
								) : (
									<BellIcon className="size-6" />
								)}
								<UnreadActivity />
							</div>
						)}
					</Link>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				{update ? (
					<button
						type="button"
						onClick={installNewUpdate}
						className="relative inline-flex flex-col items-center justify-center"
					>
						<span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-teal-500/60 ring-teal-500/80 text-teal-50 dark:bg-teal-500/10 dark:text-teal-400 ring-1 ring-inset dark:ring-teal-500/20">
							Update
						</span>
						<div className="inline-flex items-center justify-center w-full h-auto aspect-square rounded-xl text-black/50 dark:text-neutral-400">
							<ArrowUpSquareIcon className="size-6" />
						</div>
					</button>
				) : null}
				<button
					type="button"
					onClick={() => setSearch((open) => !open)}
					className="inline-flex flex-col items-center justify-center"
				>
					<div
						className={cn(
							"inline-flex aspect-square h-auto w-full items-center justify-center rounded-xl",
							search
								? "bg-black/10 text-black dark:bg-white/10 dark:text-white"
								: "text-black/50 dark:text-neutral-400",
						)}
					>
						{search ? (
							<SearchFilledIcon className="size-6" />
						) : (
							<SearchIcon className="size-6" />
						)}
					</div>
				</button>
				<Link
					to="/settings"
					className="inline-flex flex-col items-center justify-center"
				>
					{({ isActive }) => (
						<div
							className={cn(
								"inline-flex aspect-square h-auto w-full items-center justify-center rounded-xl",
								isActive
									? "bg-black/10 text-black dark:bg-white/10 dark:text-white"
									: "text-black/50 dark:text-neutral-400",
							)}
						>
							{isActive ? (
								<SettingsFilledIcon className="size-6" />
							) : (
								<SettingsIcon className="size-6" />
							)}
						</div>
					)}
				</Link>
			</div>
		</div>
	);
}
