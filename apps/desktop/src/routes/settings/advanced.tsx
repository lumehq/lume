import { useStorage } from "@lume/storage";

export function AdvancedSettingScreen() {
	const storage = useStorage();

	const clearCache = async () => {
		await storage.clearCache();
	};

	return (
		<div className="mx-auto w-full max-w-lg">
			<div className="flex flex-col gap-6">
				<div className="flex w-full items-center justify-between">
					<div className="flex items-center gap-8">
						<div className="w-24 shrink-0 text-end text-sm font-semibold">
							Cache
						</div>
						<div className="text-sm">Use for boost up nostr connection</div>
					</div>
					<button
						type="button"
						onClick={() => clearCache()}
						className="h-8 w-max rounded-lg px-3 text-sm font-semibold text-blue-500 bg-blue-100 hover:bg-blue-200"
					>
						Clear
					</button>
				</div>
			</div>
		</div>
	);
}
