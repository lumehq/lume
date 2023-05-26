import { useActiveAccount } from "@stores/accounts";
import { useEffect } from "react";
import { navigate } from "vite-plugin-ssr/client/router";

export function Page() {
	const fetchAccount = useActiveAccount((state: any) => state.fetch);
	const account = useActiveAccount((state: any) => state.account);

	if (!account) {
		navigate("/app/auth", { overwriteLastHistoryEntry: true });
	}

	if (account) {
		navigate("/app/prefetch", { overwriteLastHistoryEntry: true });
	}

	useEffect(() => {
		fetchAccount();
	}, [fetchAccount]);

	return (
		<div className="h-screen w-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white" />
	);
}
