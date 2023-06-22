import { Image } from "@shared/image";
import { useOpenGraph } from "@utils/hooks/useOpenGraph";

export function LinkPreview({ urls }: { urls: string[] }) {
	const domain = new URL(urls[0]);
	const { data, error, isLoading } = useOpenGraph(urls[0]);

	return (
		<div className="mt-3 max-w-[420px] overflow-hidden rounded-lg bg-zinc-800">
			{error && <p>failed to load</p>}
			{isLoading || !data ? (
				<div className="flex flex-col">
					<div className="w-full h-16 bg-zinc-700 animate-pulse" />
					<div className="flex flex-col gap-2 px-3 py-3">
						<div className="w-2/3 h-3 rounded bg-zinc-700 animate-pulse" />
						<div className="w-3/4 h-3 rounded bg-zinc-700 animate-pulse" />
						<div className="mt-2.5 w-1/3 h-2 rounded bg-zinc-700 animate-pulse" />
					</div>
				</div>
			) : (
				<a
					className="flex flex-col rounded-lg border border-transparent hover:border-fuchsia-900"
					href={urls[0]}
					target="_blank"
					rel="noreferrer"
				>
					{data["og:image"] && (
						<Image
							src={data["og:image"]}
							fallback="https://void.cat/d/XTmrMkpid8DGLjv1AzdvcW"
							alt={urls[0]}
							className="w-full h-44 object-cover rounded-t-lg bg-white"
						/>
					)}
					<div className="flex flex-col gap-2 px-3 py-3">
						<h5 className="leading-none font-medium text-zinc-200">
							{data["og:title"]}
						</h5>
						{data["og:description"] ? (
							<p className="leading-none text-sm text-zinc-400 line-clamp-3">
								{data["og:description"]}
							</p>
						) : (
							<></>
						)}
						<span className="mt-2.5 leading-none text-sm text-zinc-500">
							{domain.hostname}
						</span>
					</div>
				</a>
			)}
		</div>
	);
}
