import { ActiveAccount } from "@shared/accounts/active";
import { SettingsIcon } from "@shared/icons";
import { Logout } from "@shared/logout";
import { NotificationModal } from "@shared/notification/modal";
import { useAccount } from "@utils/hooks/useAccount";
import { Link } from "react-router-dom";

export function LumeBar() {
	const { status, account } = useAccount();

	return (
		<div className="rounded-xl p-2 border-t border-zinc-800/50 bg-zinc-900/80 backdrop-blur-md">
			<div className="flex items-center justify-between">
				{status === "loading" ? (
					<>
						<div className="group relative flex h-9 w-9 shrink animate-pulse items-center justify-center rounded-md bg-zinc-900" />
						<div className="group relative flex h-9 w-9 shrink animate-pulse items-center justify-center rounded-md bg-zinc-900" />
					</>
				) : (
					<>
						<ActiveAccount data={account} />
						<NotificationModal pubkey={account.pubkey} />
					</>
				)}
				<Link
					to="/settings/general"
					className="inline-flex items-center justify-center w-9 h-9 rounded-md border-t bg-zinc-800 border-zinc-700/50 transform active:translate-y-1"
				>
					<SettingsIcon className="w-4 h-4 text-zinc-400" />
				</Link>
				<Logout />
			</div>
		</div>
	);
}
