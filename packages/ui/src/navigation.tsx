import {
	ComposeFilledIcon,
	ComposeIcon,
	DepotFilledIcon,
	DepotIcon,
	HomeFilledIcon,
	HomeIcon,
	NwcFilledIcon,
	NwcIcon,
	RelayFilledIcon,
	RelayIcon,
	SettingsFilledIcon,
	SettingsIcon,
} from "@lume/icons";
import { cn, editorAtom } from "@lume/utils";
import { useAtom } from "jotai";
import { useHotkeys } from "react-hotkeys-hook";
import { NavLink } from "react-router-dom";
import { ActiveAccount } from "./account/active";

export function Navigation() {
	const [isEditorOpen, setIsEditorOpen] = useAtom(editorAtom);
	useHotkeys("meta+n", () => setIsEditorOpen((state) => !state), []);

	return (
		<div className="flex flex-col justify-between w-20 h-full px-4 py-3 shrink-0">
			<div className="flex flex-col flex-1">
				<div className="flex flex-col gap-3">
					<ActiveAccount />
					<button
						type="button"
						onClick={() => setIsEditorOpen((prev) => !prev)}
						className="flex items-center justify-center h-auto w-full text-black aspect-square rounded-xl bg-black/5 hover:bg-blue-500 hover:text-white dark:bg-white/5 dark:text-white dark:hover:bg-blue-500"
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
						to="/relays"
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
									<RelayFilledIcon className="size-6" />
								) : (
									<RelayIcon className="size-6" />
								)}
							</div>
						)}
					</NavLink>
					<NavLink
						to="/depot"
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
									<DepotFilledIcon className="text-black size-6 dark:text-white" />
								) : (
									<DepotIcon className="size-6" />
								)}
							</div>
						)}
					</NavLink>
					<NavLink
						to="/nwc"
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
								<NwcIcon className="size-6 rotate-12" />
							</div>
						)}
					</NavLink>
				</div>
			</div>
			<div className="flex flex-col">
				<NavLink
					to="/settings"
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
