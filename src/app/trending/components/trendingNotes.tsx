import { Note } from "@shared/notes/note";
import { NoteSkeleton } from "@shared/notes/skeleton";
import { TitleBar } from "@shared/titleBar";
import { useQuery } from "@tanstack/react-query";

export function TrendingNotes() {
	const { status, data, isFetching } = useQuery(
		["trending-notes"],
		async () => {
			const res = await fetch("https://api.nostr.band/v0/trending/notes");
			return res.json();
		},
	);

	return (
		<div className="shrink-0 w-[360px] flex-col flex border-r border-zinc-900">
			<TitleBar title="Trending Posts" />
			<div className="scrollbar-hide flex w-full h-full flex-col justify-between gap-1.5 pt-1.5 pb-20 overflow-y-auto">
				{status === "loading" || isFetching ? (
					<div className="px-3 py-1.5">
						<div className="rounded-md bg-zinc-900 px-3 py-3 shadow-input shadow-black/20">
							<NoteSkeleton />
						</div>
					</div>
				) : (
					<div className="relative w-full flex flex-col pt-1.5">
						{data.notes.map((item) => (
							<Note key={item.id} event={item.event} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}