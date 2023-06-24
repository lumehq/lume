import { getActiveAccount } from "@libs/storage";
import { useQuery } from "@tanstack/react-query";

export function useAccount() {
	const { status, data: account } = useQuery(["currentAccount"], async () => {
		const res = await getActiveAccount();
		return res;
	});

	return { status, account };
}
