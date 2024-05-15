import { User } from "@/components/user";
import { getBitcoinDisplayValues } from "@lume/utils";
import { useRouteContext } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export function Balance({ account }: { account: string }) {
	const { ark } = useRouteContext({ strict: false });
	const [balance, setBalance] = useState(0);
	const value = useMemo(() => getBitcoinDisplayValues(balance), [balance]);

	useEffect(() => {
		async function getBalance() {
			const val = await ark.get_balance();
			setBalance(val);
		}

		getBalance();
	}, []);

	return (
		<div
			data-tauri-drag-region
			className="flex h-16 items-center justify-end px-3"
		>
			<div className="flex items-center gap-2">
				<div className="text-end">
					<div className="text-sm leading-tight text-neutral-700 dark:text-neutral-300">
						Your balance
					</div>
					<div className="font-medium leading-tight">
						₿ {value.bitcoinFormatted}
					</div>
				</div>
				<User.Provider pubkey={account}>
					<User.Root>
						<User.Avatar className="size-9 rounded-full" />
					</User.Root>
				</User.Provider>
			</div>
		</div>
	);
}
