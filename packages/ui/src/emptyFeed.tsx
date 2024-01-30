import { InfoIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { useTranslation } from "react-i18next";

export function EmptyFeed({
	text,
	subtext,
	className,
}: { text?: string; subtext?: string; className?: string }) {
	const { t } = useTranslation();

	return (
		<div
			className={cn(
				"w-full py-5 flex items-center justify-center flex-col gap-2 rounded-xl bg-neutral-50 dark:bg-neutral-950",
				className,
			)}
		>
			<InfoIcon className="size-8 text-blue-500" />
			<div className="text-center">
				<p className="font-semibold text-lg">
					{text ? text : t("global.emptyFeedTitle")}
				</p>
				<p className="leading-tight text-sm">
					{subtext ? subtext : t("global.emptyFeedSubtitle")}
				</p>
			</div>
		</div>
	);
}
