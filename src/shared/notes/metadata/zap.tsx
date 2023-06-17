import { ZapIcon } from "@shared/icons";
import { compactNumber } from "@utils/number";

export function NoteZap({ zaps }: { zaps: number }) {
	return (
		<button
			type="button"
			className="w-20 group inline-flex items-center gap-1.5"
		>
			<ZapIcon
				width={16}
				height={16}
				className="text-zinc-400 group-hover:text-blue-400"
			/>
			<span className="text-base leading-none text-zinc-400 group-hover:text-zinc-100">
				{compactNumber.format(zaps)}
			</span>
		</button>
	);
}
