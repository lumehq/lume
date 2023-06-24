import { OPENGRAPH_KEY } from "@stores/constants";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/api/http";

export function useOpenGraph(url: string) {
	const { status, data, error, isFetching } = useQuery(
		["preview", url],
		async () => {
			const result = await fetch(
				`https://skrape.dev/api/opengraph/?url=${url}&key=${OPENGRAPH_KEY}`,
				{
					method: "GET",
					timeout: 10,
				},
			);
			if (result.ok) {
				if (Object.keys(result.data).length === 0) {
					const origin = new URL(url).origin;
					const result = await fetch(
						`https://skrape.dev/api/opengraph/?url=${origin}&key=${OPENGRAPH_KEY}`,
						{
							method: "GET",
							timeout: 10,
						},
					);
					if (result.ok) {
						return result.data;
					}
				} else {
					return result.data;
				}
			} else {
				return null;
			}
		},
		{
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
		},
	);

	return {
		status,
		data,
		error,
		isFetching,
	};
}
