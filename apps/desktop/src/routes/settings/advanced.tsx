import { useStorage } from "@lume/storage";
import { useTranslation } from "react-i18next";

export function AdvancedSettingScreen() {
	const storage = useStorage();
	const { t } = useTranslation();

	const clearCache = async () => {
		await storage.clearCache();
	};

	return (
		<div className="mx-auto w-full max-w-lg">
			<div className="flex flex-col gap-6">
				<div className="flex w-full items-center justify-between">
					<div className="flex items-center gap-8">
						<div className="w-24 shrink-0 text-end text-sm font-semibold">
							{t("settings.advanced.cache.title")}
						</div>
						<div className="text-sm">
							{t("settings.advanced.cache.subtitle")}
						</div>
					</div>
					<button
						type="button"
						onClick={() => clearCache()}
						className="h-8 w-max rounded-lg px-3 text-sm font-semibold text-blue-500 bg-blue-100 hover:bg-blue-200"
					>
						{t("settings.advanced.cache.button")}
					</button>
				</div>
			</div>
		</div>
	);
}
