import ArrowLeftIcon from "@icons/arrowLeft";
import ArrowRightIcon from "@icons/arrowRight";
import RefreshIcon from "@icons/refresh";

import useSWR from "swr";

const fetcher = async () => {
	const { platform } = await import("@tauri-apps/api/os");
	return await platform();
};

export default function AppHeader() {
	const { data: platform } = useSWR("platform", fetcher);

	const goBack = () => {
		window.history.back();
	};

	const goForward = () => {
		window.history.forward();
	};

	const reload = () => {
		window.location.reload();
	};

	return (
		<div
			data-tauri-drag-region
			className="flex h-full w-full flex-1 items-center px-2"
		>
			<div
				className={`flex h-full items-center gap-2 ${
					platform === "darwin" ? "pl-[68px]" : ""
				}`}
			>
				<button
					type="button"
					onClick={() => goBack()}
					className="group inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-900"
				>
					<ArrowLeftIcon
						width={14}
						height={14}
						className="text-zinc-500 group-hover:text-zinc-300"
					/>
				</button>
				<button
					type="button"
					onClick={() => goForward()}
					className="group inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-900"
				>
					<ArrowRightIcon
						width={14}
						height={14}
						className="text-zinc-500 group-hover:text-zinc-300"
					/>
				</button>
				<button
					type="button"
					onClick={() => reload()}
					className="group inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-900"
				>
					<RefreshIcon
						width={14}
						height={14}
						className="text-zinc-500 group-hover:text-zinc-300"
					/>
				</button>
			</div>
		</div>
	);
}
