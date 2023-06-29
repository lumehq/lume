import * as Tooltip from "@radix-ui/react-tooltip";
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
		<Tooltip.Root delayDuration={150}>
			<button
				type="button"
				onClick={() => setReply(id, rootID, pubkey)}
				className="group w-20 h-6 group inline-flex items-center gap-1.5"
			>
				<Tooltip.Trigger asChild>
					<span className="inline-flex items-center justify-center w-6 h-6 rounded group-hover:bg-zinc-800">
						<ReplyIcon className="w-4 h-4 text-zinc-400 group-hover:text-green-500" />
					</span>
				</Tooltip.Trigger>
				<span className="text-base leading-none text-zinc-400 group-hover:text-zinc-100">
					{compactNumber.format(replies)}
				</span>
			</button>
			<Tooltip.Portal>
				<Tooltip.Content
					className="-left-10 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade select-none text-sm rounded-md text-zinc-100 bg-zinc-800/80 backdrop-blur-lg px-3.5 py-1.5 leading-none will-change-[transform,opacity]"
					sideOffset={5}
				>
					Quick reply
					<Tooltip.Arrow className="fill-zinc-800/80 backdrop-blur-lg" />
				</Tooltip.Content>
			</Tooltip.Portal>
		</Tooltip.Root>
	);
}
