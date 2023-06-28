import { RepostIcon } from "@shared/icons";
import { useComposer } from "@stores/composer";
import { compactNumber } from "@utils/number";

export function NoteRepost({
	id,
	pubkey,
	reposts,
}: { id: string; pubkey: string; reposts: number }) {
	const setRepost = useComposer((state) => state.setRepost);

	return (
		<button
			type="button"
			onClick={() => setRepost(id, pubkey)}
			className="w-20 group inline-flex items-center gap-1.5"
		>
			<RepostIcon
				width={16}
				height={16}
				className="text-zinc-400 group-hover:text-blue-400"
			/>
			<span className="text-base leading-none text-zinc-400 group-hover:text-zinc-100">
				{compactNumber.format(reposts)}
			</span>
		</button>
	);
}
