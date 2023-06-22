import { ArrowLeftIcon, ArrowRightIcon } from "@shared/icons";
import useSWR from "swr";

const fetcher = async () => {
	const { platform } = await import("@tauri-apps/api/os");
	return platform();
};

export function AppHeader() {
	const { data: platform } = useSWR(
		typeof window !== "undefined" ? "platform" : null,
		fetcher,
	);

	const goBack = () => {
		window.history.back();
	};

	const goForward = () => {
		window.history.forward();
	};

	return (
		<div
			data-tauri-drag-region
			className={`flex h-11 w-full px-3 border-b border-zinc-900 items-center ${
				platform === "darwin" ? "justify-end" : "justify-start"
			}`}
		>
			<div className="flex gap-2.5">
				<button
					type="button"
					onClick={() => goBack()}
					className="group inline-flex h-6 w-6 items-center justify-center rounded hover:bg-zinc-900"
				>
					<ArrowLeftIcon
						width={16}
						height={16}
						className="text-zinc-500 group-hover:text-zinc-300"
					/>
				</button>
				<button
					type="button"
					onClick={() => goForward()}
					className="group inline-flex h-6 w-6 items-center justify-center rounded hover:bg-zinc-900"
				>
					<ArrowRightIcon
						width={16}
						height={16}
						className="text-zinc-500 group-hover:text-zinc-300"
					/>
				</button>
			</div>
		</div>
	);
}
