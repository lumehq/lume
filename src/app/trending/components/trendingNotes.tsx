import { Profile } from "@app/trending/components/profile";
import { NoteBase } from "@shared/notes/base";
import { NoteSkeleton } from "@shared/notes/skeleton";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function TrendingNotes() {
	const { data, error } = useSWR(
		"https://api.nostr.band/v0/trending/notes",
		fetcher,
	);

	return (
		<div className="shrink-0 w-[360px] flex-col flex border-r border-zinc-900">
			<div
				data-tauri-drag-region
				className="h-11 w-full flex items-center justify-center px-3 border-b border-zinc-900"
			>
				<h3 className="font-semibold text-zinc-100">Trending Profiles</h3>
			</div>
			<div className="scrollbar-hide flex w-full h-full flex-col justify-between gap-1.5 pt-1.5 pb-20 overflow-y-auto">
				{error && <p>Failed to load...</p>}
				{!data ? (
					<div className="px-3 py-1.5">
						<div className="rounded-md bg-zinc-900 px-3 py-3 shadow-input shadow-black/20">
							<NoteSkeleton />
						</div>
					</div>
				) : (
					<div className="relative w-full flex flex-col pt-1.5">
						{data.notes.map((item) => (
							<NoteBase key={item.id} event={item.event} metadata={false} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
