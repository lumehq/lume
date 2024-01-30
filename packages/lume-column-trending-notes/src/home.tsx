import { TextNote, useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { type NDKEvent, type NostrEvent } from "@nostr-dev-kit/ndk";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/plugin-http";
import { useEffect, useMemo, useRef } from "react";
import { CacheSnapshot, VList, VListHandle } from "virtua";

export function HomeRoute({ colKey }: { colKey: string }) {
	const ark = useArk();
	const ref = useRef<VListHandle>();
	const cacheKey = `${colKey}-vlist`;

	const [offset, cache] = useMemo(() => {
		const serialized = sessionStorage.getItem(cacheKey);
		if (!serialized) return [];
		return JSON.parse(serialized) as [number, CacheSnapshot];
	}, []);

	const { data, isLoading } = useQuery({
		queryKey: [colKey],
		queryFn: async ({ signal }: { signal: AbortSignal }) => {
			const res = await fetch("https://api.nostr.band/v0/trending/notes", {
				signal,
			});

			if (!res) throw new Error("Failed to fetch trending notes");

			const data = await res.json();
			const events = data.notes.map((item: { event: NostrEvent }) =>
				ark.getNDKEvent(item.event),
			);

			return events as NDKEvent[];
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (!ref.current) return;
		const handle = ref.current;

		if (offset) {
			handle.scrollTo(offset);
		}

		return () => {
			sessionStorage.setItem(
				cacheKey,
				JSON.stringify([handle.scrollOffset, handle.cache]),
			);
		};
	}, []);

	return (
		<div className="w-full h-full">
			<VList ref={ref} cache={cache} overscan={2} className="flex-1 px-3">
				{isLoading ? (
					<div className="w-full flex h-16 items-center justify-center gap-2 px-3 py-1.5">
						<LoaderIcon className="size-5 animate-spin" />
					</div>
				) : (
					data.map((item) => (
						<TextNote key={item.id} event={item} className="mt-3" />
					))
				)}
			</VList>
		</div>
	);
}
