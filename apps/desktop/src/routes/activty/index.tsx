import { activityUnreadAtom } from "@lume/utils";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ActivityList } from "./components/list";

export function ActivityScreen() {
	const setUnreadActivity = useSetAtom(activityUnreadAtom);

	useEffect(() => {
		setUnreadActivity(0);
	}, []);

	return (
		<div className="flex h-full w-full rounded-xl shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:shadow-none dark:ring-1 dark:ring-white/10">
			<div className="h-full flex flex-col w-96 shrink-0 rounded-l-xl bg-white/50 backdrop-blur-xl dark:bg-black/50">
				<div className="h-14 shrink-0 flex items-center px-5 text-lg font-semibold border-b border-black/10 dark:border-white/10">
					Activity
				</div>
				<ActivityList />
			</div>
			<div className="flex-1 rounded-r-xl bg-white pb-20 dark:bg-black">
				<Outlet />
			</div>
		</div>
	);
}
