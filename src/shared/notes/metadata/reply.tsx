import { ReplyIcon } from "@shared/icons";
import { useComposer } from "@stores/composer";
import { compactNumber } from "@utils/number";

export function NoteReply({
	id,
	rootID,
	pubkey,
	replies,
}: { id: string; rootID?: string; pubkey: string; replies: number }) {
	const setReply = useComposer((state) => state.setReply);

	return (
		<button
			type="button"
			onClick={() => setReply(id, rootID, pubkey)}
			className="w-20 group inline-flex items-center gap-1.5"
		>
			<ReplyIcon
				width={16}
				height={16}
				className="text-zinc-400 group-hover:text-green-400"
			/>
			<span className="text-base leading-none text-zinc-400 group-hover:text-zinc-100">
				{compactNumber.format(replies)}
			</span>
		</button>
	);
}
