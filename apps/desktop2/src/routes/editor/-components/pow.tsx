import { PowIcon } from "@lume/icons";
import type { Dispatch, SetStateAction } from "react";

export function PowButton({
	setDifficulty,
}: {
	setDifficulty: Dispatch<SetStateAction<{ enable: boolean; num: number }>>;
}) {
	return (
		<button
			type="button"
			onClick={() =>
				setDifficulty((prev) => ({ ...prev, enable: !prev.enable }))
			}
			className="inline-flex items-center h-8 gap-2 px-2.5 text-sm rounded-lg text-black/70 dark:text-white/70 w-max hover:bg-black/10 dark:hover:bg-white/10"
		>
			<PowIcon className="size-4" />
			PoW
		</button>
	);
}
