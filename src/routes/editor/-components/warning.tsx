import { NsfwIcon } from "@/components";
import type { Dispatch, SetStateAction } from "react";

export function WarningButton({
	setWarning,
}: {
	setWarning: Dispatch<SetStateAction<{ enable: boolean; reason: string }>>;
}) {
	return (
		<button
			type="button"
			onClick={() => setWarning((prev) => ({ ...prev, enable: !prev.enable }))}
			className="inline-flex items-center h-8 gap-2 px-2.5 text-sm rounded-lg text-black/70 dark:text-white/70 w-max hover:bg-black/10 dark:hover:bg-white/10"
		>
			<NsfwIcon className="size-4" />
			Mark as sensitive
		</button>
	);
}
