import {
	DepotFilledIcon,
	DepotIcon,
	HomeFilledIcon,
	HomeIcon,
	NwcFilledIcon,
	NwcIcon,
	PlusIcon,
	RelayFilledIcon,
	RelayIcon,
} from "@lume/icons";
import { cn, editorAtom } from "@lume/utils";
import { useSetAtom } from "jotai";
import { NavLink } from "react-router-dom";
import { ActiveAccount } from "./account/active";

export function Navigation() {
	const setIsEditorOpen = useSetAtom(editorAtom);

	return (
		<div className="flex flex-col justify-between w-20 h-full px-4 py-3 shrink-0">
			<div className="flex flex-col flex-1 gap-5">
				<NavLink
					to="/"
					preventScrollReset={true}
					className="inline-flex flex-col items-center justify-center"
				>
					{({ isActive }) => (
						<>
							<div
								className={cn(
									"inline-flex aspect-square h-auto w-full items-center justify-center rounded-xl",
									isActive
										? "bg-black/10 text-black dark:bg-white/10 dark:text-white"
										: "text-black/50 dark:text-neutral-400",
								)}
							>
								{isActive ? (
									<HomeFilledIcon className="text-black size-6 dark:text-white" />
								) : (
									<HomeIcon className="size-6" />
								)}
							</div>
							<div
								className={cn(
									"text-sm",
									isActive
										? "font-semibold text-black dark:text-white"
										: "font-medium text-black/50 dark:text-white/50",
								)}
							>
								Home
							</div>
						</>
					)}
				</NavLink>
				<NavLink
					to="/relays"
					preventScrollReset={true}
					className="inline-flex flex-col items-center justify-center"
				>
					{({ isActive }) => (
						<>
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
							<div
								className={cn(
									"text-sm",
									isActive
										? "font-semibold text-black dark:text-white"
										: "font-medium text-black/50 dark:text-white/50",
								)}
							>
								Relays
							</div>
						</>
					)}
				</NavLink>
				<NavLink
					to="/depot"
					preventScrollReset={true}
					className="inline-flex flex-col items-center justify-center"
				>
					{({ isActive }) => (
						<>
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
							<div
								className={cn(
									"text-sm",
									isActive
										? "font-semibold text-black dark:text-white"
										: "font-medium text-black/50 dark:text-white/50",
								)}
							>
								Depot
							</div>
						</>
					)}
				</NavLink>
				<NavLink
					to="/nwc"
					preventScrollReset={true}
					className="inline-flex flex-col items-center justify-center"
				>
					{({ isActive }) => (
						<>
							<div
								className={cn(
									"inline-flex aspect-square h-auto w-full items-center justify-center rounded-xl",
									isActive
										? "bg-black/10 text-black dark:bg-white/10 dark:text-white"
										: "text-black/50 dark:text-neutral-400",
								)}
							>
								{isActive ? (
									<NwcFilledIcon className="text-black size-6 dark:text-white" />
								) : (
									<NwcIcon className="size-6" />
								)}
							</div>
							<div
								className={cn(
									"text-sm",
									isActive
										? "font-semibold text-black dark:text-white"
										: "font-medium text-black/50 dark:text-white/50",
								)}
							>
								Wallet
							</div>
						</>
					)}
				</NavLink>
			</div>
			<div className="flex flex-col gap-3 p-1 shrink-0">
				<button
					type="button"
					onClick={() => setIsEditorOpen((prev) => !prev)}
					className="flex items-center justify-center w-full h-auto text-black aspect-square rounded-xl bg-black/10 hover:bg-blue-500 hover:text-white dark:bg-white/10 dark:text-white dark:hover:bg-blue-500"
				>
					<PlusIcon className="w-5 h-5" />
				</button>
				<ActiveAccount />
			</div>
		</div>
	);
}
