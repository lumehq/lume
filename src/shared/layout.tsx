import { Navigation } from "@shared/navigation";
import useSWR from "swr";

const fetcher = async () => {
	const { platform } = await import("@tauri-apps/api/os");
	return platform();
};

export function DefaultLayout({ children }: { children: React.ReactNode }) {
	const { data: platform } = useSWR(
		typeof window !== "undefined" ? "platform" : null,
		fetcher,
	);

	return (
		<div className="flex w-screen h-screen">
			<div className="relative flex flex-row shrink-0">
				<Navigation reverse={platform !== "darwin"} />
			</div>
			<div className="w-full h-full">{children}</div>
		</div>
	);
}
