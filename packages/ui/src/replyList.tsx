import { Reply, useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { NDKEventWithReplies } from "@lume/types";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export function ReplyList({
	eventId,
	title,
	className,
}: { eventId: string; title?: string; className?: string }) {
	const ark = useArk();
	const [data, setData] = useState<null | NDKEventWithReplies[]>(null);

	useEffect(() => {
		let sub;
		let isCancelled = false;

		async function fetchRepliesAndSub() {
			const events = await ark.getThreads({ id: eventId });
			if (!isCancelled) {
				setData(events);
			}
			// subscribe for new replies
			sub = ark.subscribe({
				filter: {
					"#e": [eventId],
					since: Math.floor(Date.now() / 1000),
				},
				closeOnEose: false,
				cb: (event: NDKEventWithReplies) => setData((prev) => [event, ...prev]),
			});
		}

		fetchRepliesAndSub();

		return () => {
			isCancelled = true;
			if (sub) sub.stop();
		};
	}, [eventId]);

	return (
		<div className={twMerge("flex flex-col gap-5", className)}>
			<h3 className="font-semibold">{title}</h3>
			{!data ? (
				<div className="flex h-16 items-center justify-center rounded-xl bg-neutral-50 p-3 dark:bg-neutral-950">
					<LoaderIcon className="h-5 w-5 animate-spin" />
				</div>
			) : data.length === 0 ? (
				<div className="flex w-full items-center justify-center bg-neutral-50 dark:bg-neutral-950 rounded-lg">
					<div className="flex flex-col items-center justify-center gap-2 py-6">
						<h3 className="text-3xl">👋</h3>
						<p className="leading-none text-neutral-600 dark:text-neutral-400">
							Be the first to Reply!
						</p>
					</div>
				</div>
			) : (
				data.map((event) => <Reply key={event.id} event={event} />)
			)}
		</div>
	);
}
