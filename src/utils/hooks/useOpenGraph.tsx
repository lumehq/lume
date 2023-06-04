import { OPENGRAPH_KEY } from "@stores/constants";
import { fetch } from "@tauri-apps/api/http";
import useSWR from "swr";

const fetcher = async (url: string) => {
	const result = await fetch(url, {
		method: "GET",
		timeout: 20,
	});
	if (result.ok) {
		return result.data;
	} else {
		return null;
	}
};

export function useOpenGraph(url: string) {
	const { data, error, isLoading } = useSWR(
		`https://skrape.dev/api/opengraph/?url=${url}&key=${OPENGRAPH_KEY}`,
		fetcher,
	);

	return {
		data: data,
		error: error,
		isLoading: isLoading,
	};
}
