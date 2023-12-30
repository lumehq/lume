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
	SearchIcon,
} from "@lume/icons";
import { cn } from "@lume/utils";
import { Link, NavLink } from "react-router-dom";
import { ActiveAccount } from "./account/active";

export function Navigation() {
	return (
		<div className="flex h-full w-20 shrink-0 flex-col justify-between px-4 py-3">
			<div className="flex flex-1 flex-col gap-5">
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
									<HomeFilledIcon className="size-6 text-black dark:text-white" />
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
									<DepotFilledIcon className="size-6 text-black dark:text-white" />
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
									<NwcFilledIcon className="size-6 text-black dark:text-white" />
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
			<div className="flex shrink-0 flex-col gap-3 p-1">
				<Link
					to="/new/"
					className="flex aspect-square h-auto w-full items-center justify-center rounded-xl bg-black/10 text-black hover:bg-blue-500 hover:text-white dark:bg-white/10 dark:text-white dark:hover:bg-blue-500"
				>
					<PlusIcon className="h-5 w-5" />
				</Link>
				<Link
					to="/nwc"
					className="flex aspect-square h-auto w-full items-center justify-center rounded-xl bg-black/10 hover:bg-blue-500 hover:text-white dark:bg-white/10 dark:hover:bg-blue-500"
				>
					<SearchIcon className="h-5 w-5" />
				</Link>
				<ActiveAccount />
			</div>
		</div>
	);
}
