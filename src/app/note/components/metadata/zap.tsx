import ZapIcon from "@shared/icons/zap";
import { useEffect, useMemo, useState } from "react";

export default function NoteZap({ zaps }: { zaps: number }) {
	const formatter = useMemo(
		() => Intl.NumberFormat("en", { notation: "compact" }),
		[],
	);
	const [count, setCount] = useState(0);

	useEffect(() => {
		setCount(zaps);
	}, [zaps]);

	return (
		<button type="button" className="group inline-flex items-center gap-1.5">
			<ZapIcon
				width={16}
				height={16}
				className="text-zinc-400 group-hover:text-orange-400"
			/>
			<span className="text-sm leading-none text-zinc-400 group-hover:text-zinc-200">
				{formatter.format(count)} sats
			</span>
		</button>
	);
}
