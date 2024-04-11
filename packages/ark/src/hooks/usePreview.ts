import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function usePreview(url: string) {
	const { isLoading, isError, data } = useQuery({
		queryKey: ["url", url],
		queryFn: async () => {
			try {
				const cmd = await invoke("fetch_opg", { url });
				console.log(cmd);
				return cmd;
			} catch (e) {
				throw new Error(e);
			}
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		staleTime: Infinity,
		retry: 2,
	});

	return { isLoading, isError, data };
}
