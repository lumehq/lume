import { TrendingNotes } from "@app/trending/components/trendingNotes";
import { TrendingProfiles } from "@app/trending/components/trendingProfiles";

export function Page() {
	return (
		<div className="h-full w-full flex flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
			<TrendingProfiles />
			<TrendingNotes />
		</div>
	);
}
