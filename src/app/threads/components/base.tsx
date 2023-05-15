import { ThreadAuthor } from "@app/threads/components/author";

export function ThreadBase({ event }: { event: any }) {
	const metadata = JSON.parse(event.metadata);
	const title = metadata.find((i: any) => i[0] === "title")[1];
	const summary = metadata.find((i: any) => i[0] === "summary")[1] || "";

	return (
		<div className="h-min w-full px-3 py-1.5">
			<div className="rounded-md border border-zinc-800 bg-zinc-900 shadow-input shadow-black/20">
				<div className="px-3 py-3">
					<h3>{title}</h3>
					<p>{summary}</p>
				</div>
				<div className="inline-flex w-full justify-between items-center px-3 h-10">
					<ThreadAuthor pubkey={event.pubkey} time={event.created_at} />
				</div>
			</div>
		</div>
	);
}
