import { ChevronUpIcon } from "@lume/icons";
import { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
import { useEffect, useState } from "react";
import { useArk } from "../../provider";

export function ColumnLiveWidget({
	filter,
	onClick,
}: {
	filter: NDKFilter;
	onClick: (event: NDKEvent[]) => void;
}) {
	const ark = useArk();
	const [events, setEvents] = useState<NDKEvent[]>([]);

	const update = async () => {
		onClick(events);
		// reset
		setEvents([]);
	};

	useEffect(() => {
		const sub = ark.subscribe({
			filter,
			closeOnEose: false,
			cb: (event: NDKEvent) => setEvents((prev) => [...prev, event]),
		});

		return () => {
			if (sub) sub.stop();
		};
	}, []);

	if (!events.length) return null;

	return (
		<div className="absolute left-0 z-50 flex items-center justify-center w-full top-11 h-11">
			<button
				type="button"
				onClick={update}
				className="inline-flex items-center justify-center h-8 gap-1 pl-2 pr-2.5 text-sm font-semibold rounded-full w-max bg-neutral-950 dark:bg-neutral-50 hover:bg-neutral-900 dark:hover:bg-neutral-100 text-neutral-50 dark:text-neutral-950"
			>
				<ChevronUpIcon className="w-4 h-4" />
				{events.length} {events.length === 1 ? "new note" : "new notes"}
			</button>
		</div>
	);
}
