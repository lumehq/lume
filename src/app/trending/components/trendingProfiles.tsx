import { Profile } from "@app/trending/components/profile";
import { NoteSkeleton } from "@shared/notes/skeleton";
import { TitleBar } from "@shared/titleBar";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function TrendingProfiles() {
	const { data, error } = useSWR(
		"https://api.nostr.band/v0/trending/profiles",
		fetcher,
	);

	return (
		<div className="shrink-0 w-[360px] flex-col flex border-r border-zinc-900">
			<TitleBar title="Trending Profiles" />
			<div className="scrollbar-hide flex w-full h-full flex-col justify-between gap-1.5 pt-1.5 pb-20 overflow-y-auto">
				{error && <p>Failed to load...</p>}
				{!data ? (
					<div className="px-3 py-1.5">
						<div className="rounded-md bg-zinc-900 px-3 py-3 shadow-input shadow-black/20">
							<NoteSkeleton />
						</div>
					</div>
				) : (
					<div className="relative w-full flex flex-col gap-3 px-3 pt-1.5">
						{data.profiles.map((item) => (
							<Profile key={item.pubkey} data={item} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
