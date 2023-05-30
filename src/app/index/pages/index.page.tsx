import { useActiveAccount } from "@stores/accounts";
import { useEffect } from "react";
import { navigate } from "vite-plugin-ssr/client/router";

export function Page() {
	const fetchLastLogin = useActiveAccount((state: any) => state.fetchLastLogin);
	const fetchAccount = useActiveAccount((state: any) => state.fetch);
	const account = useActiveAccount((state: any) => state.account);

	if (!account && typeof window !== "undefined") {
		navigate("/app/auth", { overwriteLastHistoryEntry: true });
	}

	if (account && typeof window !== "undefined") {
		navigate("/app/prefetch", { overwriteLastHistoryEntry: true });
	}

	useEffect(() => {
		fetchAccount();
		fetchLastLogin();
	}, [fetchAccount, fetchLastLogin]);

	return (
		<div className="h-screen w-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white" />
	);
}
