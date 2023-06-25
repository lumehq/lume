import { createBlock } from "@libs/storage";
import { ReplyIcon } from "@shared/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { compactNumber } from "@utils/number";

export function NoteReply({
	id,
	replies,
}: { id: string; replies: number; currentBlock?: number }) {
	const queryClient = useQueryClient();

	const block = useMutation({
		mutationFn: (data: any) => createBlock(data.kind, data.title, data.content),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blocks"] });
		},
	});

	const openThread = (event: any, thread: string) => {
		const selection = window.getSelection();
		if (selection.toString().length === 0) {
			block.mutate({ kind: 2, title: "Thread", content: thread });
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
