import { useQuery } from "@tanstack/react-query";
import { useArk } from "../../hooks/useArk";
import { AppHandler } from "./appHandler";
import { useNoteContext } from "./provider";

export function NIP89({ className }: { className?: string }) {
	const ark = useArk();
	const event = useNoteContext();

	const { isLoading, isError, data } = useQuery({
		queryKey: ["app-recommend", event.id],
		queryFn: () => {
			return ark.getAppRecommend({
				unknownKind: event.kind.toString(),
				author: event.pubkey,
			});
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		staleTime: Infinity,
	});

	if (isLoading) {
		<div>Loading...</div>;
	}

	if (isError || !data) {
		return <div>Error</div>;
	}

	return (
		<div className={className}>
			<div className="flex flex-col rounded-lg bg-neutral-100 dark:bg-neutral-900">
				<div className="inline-flex items-center justify-between h-10 px-3 border-b shrink-0 border-neutral-200 dark:border-neutral-800">
					<p className="text-sm font-medium text-amber-400">
						Lume isn't support this event
					</p>
					<p className="text-sm text-neutral-600 dark:text-neutral-400">
						{event.kind}
					</p>
				</div>
				<div className="flex flex-col flex-1 gap-2 px-3 py-3">
					<span className="text-sm font-medium uppercase text-neutral-600 dark:text-neutral-400">
						Open with
					</span>
					{data.map((item, index) => (
						<AppHandler key={item[1] + index} tag={item} />
					))}
				</div>
			</div>
		</div>
	);
}
