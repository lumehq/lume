import { getActiveAccount } from "@utils/storage";

import useSWR from "swr";
import { navigate } from "vite-plugin-ssr/client/router";

const fetcher = () => getActiveAccount();

export function Page() {
	const { data, isLoading } = useSWR("account", fetcher, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});

	if (!isLoading && !data) {
		navigate("/app/auth", { overwriteLastHistoryEntry: true });
	}

	if (!isLoading && data) {
		navigate("/app/inital-data", { overwriteLastHistoryEntry: true });
	}

	return (
		<div className="h-screen w-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white" />
	);
}
