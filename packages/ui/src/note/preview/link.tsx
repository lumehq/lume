import { useOpenGraph } from "@lume/utils";

function isImage(url: string) {
	return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif)$/.test(url);
}

export function LinkPreview({ url }: { url: string }) {
	const domain = new URL(url);
	const { isLoading, isError, data } = useOpenGraph(url);

	if (isLoading) {
		return (
			<div className="my-1.5 flex w-full flex-col overflow-hidden rounded-2xl border border-black/10 p-3 dark:border-white/10">
				<div className="h-48 w-full shrink-0 animate-pulse bg-neutral-300 dark:bg-neutral-700" />
				<div className="flex flex-col gap-2 px-3 py-3">
					<div className="h-3 w-2/3 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
					<div className="h-3 w-3/4 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
					<span className="mt-2.5 text-sm leading-none text-neutral-600 dark:text-neutral-400">
						{domain.hostname}
					</span>
				</div>
			</div>
		);
	}

	if (!data.title && !data.image && !data.description) {
		return (
			<a
				href={url}
				target="_blank"
				rel="noreferrer"
				className="inline-block text-blue-500 hover:text-blue-600"
			>
				{url}
			</a>
		);
	}

	if (isError) {
		return (
			<a
				href={url}
				target="_blank"
				rel="noreferrer"
				className="inline-block text-blue-500 hover:text-blue-600"
			>
				{url}
			</a>
		);
	}

	return (
		<a
			href={url}
			target="_blank"
			rel="noreferrer"
			className="my-1 flex w-full flex-col overflow-hidden rounded-2xl border border-black/10 dark:border-white/10"
		>
			{isImage(data.image) ? (
				<img
					src={data.image}
					alt={url}
					loading="lazy"
					decoding="async"
					className="h-48 w-full shrink-0 rounded-t-lg bg-white object-cover"
				/>
			) : null}
			<div className="flex flex-col items-start p-3">
				<div className="flex flex-col items-start text-left">
					{data.title ? (
						<div className="content-break line-clamp-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">
							{data.title}
						</div>
					) : null}
					{data.description ? (
						<div className="content-break mb-2 line-clamp-3 text-balance text-sm text-neutral-700 dark:text-neutral-400">
							{data.description}
						</div>
					) : null}
				</div>
				<div className="break-all text-sm font-semibold text-blue-500">
					{domain.hostname}
				</div>
			</div>
		</a>
	);
}
