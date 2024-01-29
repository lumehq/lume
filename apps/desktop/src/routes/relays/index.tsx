import { cn } from "@lume/utils";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router-dom";
import { RelaySidebar } from "./components/sidebar";

export function RelaysScreen() {
	const { t } = useTranslation();

	return (
		<div className="grid h-full w-full lg:grid-cols-4 xl:grid-cols-5 rounded-xl shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:shadow-none dark:ring-1 dark:ring-white/10">
			<RelaySidebar className="col-span-1" />
			<div className="col-span-3 xl:col-span-4 flex flex-col rounded-r-xl bg-white dark:bg-black">
				<div className="h-14 shrink-0 flex px-5 items-center gap-6 border-b border-neutral-100 dark:border-neutral-950">
					<NavLink
						end
						to={"/relays/"}
						className={({ isActive }) =>
							cn(
								"h-9 w-24 rounded-lg inline-flex items-center justify-center font-medium",
								isActive
									? "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-950 dark:hover:bg-neutral-900"
									: "",
							)
						}
					>
						{t("relays.global")}
					</NavLink>
					<NavLink
						to={"/relays/follows/"}
						className={({ isActive }) =>
							cn(
								"h-9 w-24 rounded-lg inline-flex items-center justify-center font-medium",
								isActive
									? "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-950 dark:hover:bg-neutral-900"
									: "",
							)
						}
					>
						{t("relays.follows")}
					</NavLink>
				</div>
				<div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
