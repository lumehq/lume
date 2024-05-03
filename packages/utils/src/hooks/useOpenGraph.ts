import type { Opengraph } from "@lume/types";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useOpenGraph(url: string) {
	const { isLoading, isError, data } = useQuery({
		queryKey: ["opg", url],
		queryFn: async () => {
			try {
				const res: Opengraph = await invoke("fetch_opg", { url });
				return res;
			} catch {
				throw new Error("fetch preview failed");
			}
		},
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
	});

	return {
		isLoading,
		isError,
		data,
	};
}
