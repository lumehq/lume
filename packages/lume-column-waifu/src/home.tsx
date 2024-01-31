import { LoaderIcon, RefreshIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { useQuery } from "@tanstack/react-query";

export function HomeRoute({ colKey }: { colKey: string }) {
	const { data, isLoading, isError, isRefetching, refetch } = useQuery({
		queryKey: [colKey],
		queryFn: async ({ signal }: { signal: AbortSignal }) => {
			const apiUrl = "https://api.waifu.im/search";
			const params = {
				included_tags: "waifu",
				height: ">=2000",
			};

			const queryParams = new URLSearchParams(params);
			const requestUrl = `${apiUrl}?${queryParams}`;

			const res = await fetch(requestUrl, { signal });

			if (!res.ok) throw new Error("Failed to get image url");

			const data = await res.json();
			return data.images[0];
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});

	return (
		<div className="p-3 h-full flex flex-col justify-center items-center">
			{isLoading ? (
				<LoaderIcon className="size-5 animate-spin" />
			) : isError ? (
				<p className="text-center text-sm font-medium">
					Failed to get image, please try again later.
				</p>
			) : (
				<div className="relative min-h-0 flex-1 grow-0 w-full rounded-xl flex items-stretch">
					<img
						src={data.url}
						alt={data.signature}
						loading="lazy"
						decoding="async"
						className="object-cover w-full rounded-xl ring-1 ring-black/5 dark:ring-white/5"
					/>
					<div className="absolute bottom-3 right-3 flex items-center gap-2">
						<button
							type="button"
							onClick={() => refetch()}
							className="text-sm font-medium px-2 h-7 inline-flex items-center justify-center bg-black/50 hover:bg-black/30 backdrop-blur-2xl rounded-md text-white"
						>
							<RefreshIcon
								className={cn("size-4", isRefetching ? "animate-spin" : "")}
							/>
						</button>
						<a
							href={data.source}
							target="_blank"
							rel="noreferrer"
							className="text-sm font-medium px-2 h-7 inline-flex items-center justify-center bg-black/50 hover:bg-black/30 backdrop-blur-2xl rounded-md text-white"
						>
							Source
						</a>
					</div>
				</div>
			)}
		</div>
	);
}
