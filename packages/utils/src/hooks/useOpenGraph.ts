import { type Opengraph } from "@lume/types";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useOpenGraph(url: string) {
	const { isLoading, isError, data } = useQuery({
		queryKey: ["opg", url],
		queryFn: async () => {
			const res: Opengraph = await invoke("fetch_opg", { url });
			if (!res) {
				throw new Error("fetch preview failed");
			}
			return res;
		},
		staleTime: Infinity,
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
