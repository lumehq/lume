import ZapIcon from "@shared/icons/zap";
import { compactNumber } from "@utils/number";
import { useEffect, useState } from "react";

export default function NoteZap({ zaps }: { zaps: number }) {
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
			<span className="text-base leading-none text-zinc-400 group-hover:text-white">
				{compactNumber.format(count)} sats
			</span>
		</button>
	);
}
