import { useOpenGraph } from "@lume/utils";
import { Link } from "react-router-dom";

function isImage(url: string) {
	return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif)$/.test(url);
}

export function LinkPreview({ url }: { url: string }) {
	const domain = new URL(url);
	const { status, data } = useOpenGraph(url);

	if (status === "pending") {
		return (
			<div className="flex flex-col w-full my-1 rounded-lg bg-neutral-100 dark:bg-neutral-900">
				<div className="w-full h-48 animate-pulse bg-neutral-300 dark:bg-neutral-700" />
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

	if (!data.title && !data.image) {
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
			className="flex flex-col w-full my-1 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900"
		>
			{isImage(data.image) ? (
				<img
					src={data.image}
					alt={url}
					className="object-cover w-full h-48 bg-white rounded-t-lg"
				/>
			) : null}
			<div className="flex flex-col items-start px-3 py-3">
				<div className="flex flex-col items-start gap-1 text-left">
					{data.title ? (
						<div className="text-base font-semibold break-all text-neutral-900 dark:text-neutral-100">
							{data.title}
						</div>
					) : null}
					{data.description ? (
						<div className="mb-2 text-sm break-all line-clamp-3 text-neutral-700 dark:text-neutral-400">
							{data.description}
						</div>
					) : null}
				</div>
				<div className="text-sm break-all text-neutral-600 dark:text-neutral-400">
					{domain.hostname}
				</div>
			</div>
		</Link>
	);
}
