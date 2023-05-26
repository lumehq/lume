import { useActiveAccount } from "@utils/hooks/useActiveAccount";
import { navigate } from "vite-plugin-ssr/client/router";

export function Page() {
	const { account, isLoading } = useActiveAccount();

	if (!isLoading && !account) {
		navigate("/app/auth", { overwriteLastHistoryEntry: true });
	}

	if (!isLoading && account) {
		navigate("/app/prefetch", { overwriteLastHistoryEntry: true });
	}

	return (
		<div className="h-screen w-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white" />
	);
}
