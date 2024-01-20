import { InfoIcon } from "@lume/icons";
import { cn } from "@lume/utils";

export function EmptyFeed({
	text,
	subtext,
	className,
}: { text?: string; subtext?: string; className?: string }) {
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
					{text ? text : "This feed is empty"}
				</p>
				<p className="leading-tight text-sm">
					{subtext
						? subtext
						: "You can follow more users to build up your timeline"}
				</p>
			</div>
		</div>
	);
}
