import { getActiveAccount } from "@utils/storage";

import useSWR from "swr";

const fetcher = () => getActiveAccount();

export function useActiveAccount() {
	const { data, error, isLoading } = useSWR("activeAcount", fetcher);

	return {
		account: data,
		isLoading,
		isError: error,
	};
}
