import { Image } from "@shared/image";
import { useOpenGraph } from "@utils/hooks/useOpenGraph";

export function LinkPreview({ urls }: { urls: string[] }) {
	const domain = new URL(urls[0]);
	const { status, data, error } = useOpenGraph(urls[0]);

	return (
		<div className="mt-3 max-w-[420px] overflow-hidden rounded-lg bg-zinc-800">
			{status === "loading" ? (
				<div className="flex flex-col">
					<div className="w-full h-44 bg-zinc-700 animate-pulse" />
					<div className="flex flex-col gap-2 px-3 py-3">
						<div className="w-2/3 h-3 rounded bg-zinc-700 animate-pulse" />
						<div className="w-3/4 h-3 rounded bg-zinc-700 animate-pulse" />
						<span className="mt-2.5 leading-none text-sm text-zinc-500">
							{domain.hostname}
						</span>
					</div>
				</div>
			) : (
				<a
					className="flex flex-col rounded-lg border border-zinc-800/50"
					href={urls[0]}
					target="_blank"
					rel="noreferrer"
				>
					{error ? (
						<div className="px-3 py-3">
							<p className="text-sm text-zinc-400 break-all line-clamp-3">
								Can't fetch open graph, click to open webpage
							</p>
						</div>
					) : (
						<>
							<Image
								src={
									data.images?.[0] ||
									"https://void.cat/d/XTmrMkpid8DGLjv1AzdvcW"
								}
								fallback="https://void.cat/d/XTmrMkpid8DGLjv1AzdvcW"
								alt={urls[0]}
								className="w-full h-44 object-cover rounded-t-lg"
							/>
							<div className="flex flex-col gap-2 px-3 py-3">
								<h5 className="leading-none font-medium text-zinc-200 line-clamp-1">
									{data.title}
								</h5>
								{data.description && (
									<p className="text-sm text-zinc-400 break-all line-clamp-3">
										{data.description}
									</p>
								)}
								<span className="mt-2.5 leading-none text-sm text-zinc-500">
									{domain.hostname}
								</span>
							</div>
						</>
					)}
				</a>
			)}
		</div>
	);
}
