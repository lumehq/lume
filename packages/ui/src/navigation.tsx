import {
	BellFilledIcon,
	BellIcon,
	ComposeFilledIcon,
	ComposeIcon,
	DepotFilledIcon,
	DepotIcon,
	HomeFilledIcon,
	HomeIcon,
	SearchFilledIcon,
	SearchIcon,
	SettingsFilledIcon,
	SettingsIcon,
} from "@lume/icons";
import { cn, editorAtom, searchAtom } from "@lume/utils";
import { useAtom } from "jotai";
import { useHotkeys } from "react-hotkeys-hook";
import { NavLink } from "react-router-dom";
import { ActiveAccount } from "./account/active";
import { UnreadActivity } from "./unread";

export function Navigation() {
	const [isEditorOpen, setIsEditorOpen] = useAtom(editorAtom);
	const [search, setSearch] = useAtom(searchAtom);

	// shortcut for editor
	useHotkeys("meta+n", () => setIsEditorOpen((state) => !state), []);

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
							"flex items-center justify-center h-auto w-full text-black aspect-square rounded-xl hover:text-white dark:text-white",
							isEditorOpen
								? "bg-blue-500 text-white"
								: "bg-black/5 hover:bg-blue-500 dark:bg-white/5 dark:hover:bg-blue-500",
						)}
					>
						{isEditorOpen ? (
							<ComposeFilledIcon className="size-5" />
						) : (
							<ComposeIcon className="size-5" />
						)}
					</button>
				</div>
				<div className="my-5 w-2/3 mx-auto h-px bg-black/10 dark:bg-white/10" />
				<div className="flex flex-col gap-2">
					<NavLink
						to="/"
						preventScrollReset={true}
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
					</NavLink>
					<NavLink
						to="/activity/"
						preventScrollReset={true}
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
					</NavLink>
					<NavLink
						to="/relays/"
						preventScrollReset={true}
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
									<DepotFilledIcon className="size-6" />
								) : (
									<DepotIcon className="size-6" />
								)}
							</div>
						)}
					</NavLink>
				</div>
			</div>
			<div className="flex flex-col gap-2">
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
				<NavLink
					to="/settings/"
					preventScrollReset={true}
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
				</NavLink>
			</div>
		</div>
	);
}
