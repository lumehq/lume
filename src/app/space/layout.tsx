import { MultiAccounts } from "@shared/multiAccounts";
import { Navigation } from "@shared/navigation";
import { SWRConfig } from "swr";

export function LayoutSpace({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex w-screen h-screen">
			<div className="relative flex flex-row shrink-0">
				<MultiAccounts />
				<Navigation />
			</div>
			<div className="w-full h-full">
				<SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
			</div>
		</div>
	);
}
