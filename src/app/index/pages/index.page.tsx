import { useActiveAccount } from "@stores/accounts";
import { useEffect } from "react";
import { navigate } from "vite-plugin-ssr/client/router";

export function Page() {
	const fetchLastLogin = useActiveAccount((state: any) => state.fetchLastLogin);
	const fetchAccount = useActiveAccount((state: any) => state.fetch);
	const account = useActiveAccount((state: any) => state.account);
	const lastLogin = useActiveAccount((state: any) => state.lastLogin);

	useEffect(() => {
		if (account === null) {
			fetchAccount();
		}
		if (lastLogin === null) {
			fetchLastLogin();
		}
		if (!account) {
			navigate("/app/auth", { overwriteLastHistoryEntry: true });
		}
		if (account) {
			navigate("/app/prefetch", { overwriteLastHistoryEntry: true });
		}
	}, [fetchAccount, fetchLastLogin, account, lastLogin]);

	return (
		<div className="h-screen w-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100" />
	);
}
