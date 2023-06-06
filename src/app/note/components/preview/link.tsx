import { Image } from "@shared/image";
import { useOpenGraph } from "@utils/hooks/useOpenGraph";

export function LinkPreview({ urls }: { urls: string[] }) {
	const domain = new URL(urls[0]);
	const { data, error, isLoading } = useOpenGraph(urls[0]);

	return (
		<div className="mt-3 overflow-hidden rounded-lg bg-zinc-800">
			{error && <p>failed to load</p>}
			{isLoading && !data ? (
				<p>Loading...</p>
			) : (
				<a
					className="flex flex-col"
					href={urls[0]}
					target="_blank"
					rel="noreferrer"
				>
					<Image
						src={data["og:image"]}
						alt={urls[0]}
						className="w-full h-auto border-t-lg object-cover"
					/>
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
