import { ReplyIcon } from "@shared/icons";
import { useActiveAccount } from "@stores/accounts";
import { compactNumber } from "@utils/number";

export function NoteReply({
	id,
	replies,
	currentBlock,
}: { id: string; replies: number; currentBlock?: number }) {
	const addTempBlock = useActiveAccount((state: any) => state.addTempBlock);

	const openThread = (event: any, thread: string) => {
		const selection = window.getSelection();
		if (selection.toString().length === 0) {
			addTempBlock(currentBlock, 2, "Thread", thread);
		} else {
			event.stopPropagation();
		}
	};

	return (
		<button
			type="button"
			onClick={(e) => openThread(e, id)}
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
