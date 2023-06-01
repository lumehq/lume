import { ThreadAuthor } from "@app/threads/components/author";
import { Image } from "@shared/image";

export function ThreadBase({ event }: { event: any }) {
	const metadata = JSON.parse(event.tags);
	const title = metadata.find((i: any) => i[0] === "title")?.[1];
	const summary = metadata.find((i: any) => i[0] === "summary")?.[1];
	const image = metadata.find((i: any) => i[0] === "image")?.[1];

	if (!title) {
		return null;
	}

	return (
		<div className="h-min w-full px-3 py-1.5">
			<div className="rounded-md border border-zinc-800 bg-zinc-900 shadow-input shadow-black/20">
				<div className="px-3 py-3">
					<div className="flex flex-row gap-2">
						<div className="flex-1">
							<h3 className="text-white text-lg font-semibold">{title}</h3>
							<div className="mt-2 markdown">
								<p>{summary}</p>
							</div>
						</div>
						<div className="shrink-0 w-32 h-32">
							<Image
								src={image}
								alt={title}
								className="w-32 h-32 rounded-md object-cover"
							/>
						</div>
					</div>
				</div>
				<div className="inline-flex border-t border-zinc-800 w-full justify-between items-center px-3 h-16">
					<ThreadAuthor pubkey={event.pubkey} time={event.created_at} />
				</div>
			</div>
		</div>
	);
}
