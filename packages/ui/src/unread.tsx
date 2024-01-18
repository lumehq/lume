import { activityUnreadAtom, compactNumber } from "@lume/utils";
import { useAtomValue } from "jotai";

export function UnreadActivity() {
	const total = useAtomValue(activityUnreadAtom);

	if (total <= 0) return null;

	return (
		<div className="absolute -right-0.5 -top-0.5 inline-flex size-5 items-center justify-center rounded-full bg-teal-500 text-[9px] font-medium text-white">
			{compactNumber.format(total)}
		</div>
	);
}
