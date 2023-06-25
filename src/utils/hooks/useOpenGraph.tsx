import { getLinkPreview } from "@libs/openGraph";
import { useQuery } from "@tanstack/react-query";

export function useOpenGraph(url: string) {
	const { status, data, error, isFetching } = useQuery(
		["preview", url],
		async () => {
			return await getLinkPreview(url);
		},
		{
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
			staleTime: Infinity,
		},
	);

	return {
		status,
		data,
		error,
		isFetching,
	};
}
