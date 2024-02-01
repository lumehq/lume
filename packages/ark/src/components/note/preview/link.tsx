import { useOpenGraph } from "@lume/utils";
import { Link } from "react-router-dom";

function isImage(url: string) {
	return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif)$/.test(url);
}

export function LinkPreview({ url }: { url: string }) {
	const domain = new URL(url);
	const { isLoading, isError, data } = useOpenGraph(url);

	if (isLoading) {
		return (
			<div className="flex flex-col w-full mt-1 mb-2.5 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-black/5 dark:border-white/5">
				<div className="w-full h-48 shrink-0 animate-pulse bg-neutral-300 dark:bg-neutral-700" />
				<div className="flex flex-col gap-2 px-3 py-3">
					<div className="w-2/3 h-3 rounded animate-pulse bg-neutral-300 dark:bg-neutral-700" />
					<div className="w-3/4 h-3 rounded animate-pulse bg-neutral-300 dark:bg-neutral-700" />
					<span className="mt-2.5 text-sm leading-none text-neutral-600 dark:text-neutral-400">
						{domain.hostname}
					</span>
				</div>
			</div>
		);
	}

	if (!data.title && !data.image && !data.description) {
		return (
			<Link
				to={url}
				target="_blank"
				rel="noreferrer"
				className="text-blue-500 hover:text-blue-600"
			>
				{url}
			</Link>
		);
	}

	if (isError) {
		return (
			<Link
				to={url}
				target="_blank"
				rel="noreferrer"
				className="text-blue-500 hover:text-blue-600"
			>
				{url}
			</Link>
		);
	}

	return (
		<Link
			to={url}
			target="_blank"
			rel="noreferrer"
			className="flex flex-col w-full mt-1 mb-2.5 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-black/5 dark:border-white/5"
		>
			{isImage(data.image) ? (
				<img
					src={data.image}
					alt={url}
					loading="lazy"
					decoding="async"
					className="object-cover w-full h-48 shrink-0 bg-white rounded-t-lg"
				/>
			) : null}
			<div className="flex flex-col items-start p-3">
				<div className="flex flex-col items-start text-left">
					{data.title ? (
						<div className="text-base font-semibold break-p text-neutral-900 dark:text-neutral-100">
							{data.title}
						</div>
					) : null}
					{data.description ? (
						<div className="mb-2 text-balance text-sm break-p line-clamp-3 text-neutral-700 dark:text-neutral-400">
							{data.description}
						</div>
					) : null}
				</div>
				<div className="text-sm break-all text-blue-500 font-semibold">
					{domain.hostname}
				</div>
			</div>
		</Link>
	);
}
