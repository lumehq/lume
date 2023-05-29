import MultiAccounts from "@shared/multiAccounts";
import Navigation from "@shared/navigation";

export function LayoutNewsfeed({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex w-screen h-screen">
			<div className="relative flex flex-row flex-wrap shrink-0">
				<MultiAccounts />
				<Navigation />
			</div>
			<div className="w-full h-full">{children}</div>
		</div>
	);
}