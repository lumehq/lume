import { useActiveAccount } from "@stores/accounts";

export function NoteWrapper({
	children,
	thread,
	block,
	className,
}: {
	children: React.ReactNode;
	thread: string;
	block: number;
	className: string;
}) {
	const addTempBlock = useActiveAccount((state: any) => state.addTempBlock);

	const openThread = (event: any, thread: string) => {
		const selection = window.getSelection();
		if (selection.toString().length === 0) {
			addTempBlock(block, 2, "Thread", thread);
		} else {
			event.stopPropagation();
		}
	};

	return (
		<div
			onClick={(e) => openThread(e, thread)}
			onKeyDown={(e) => openThread(e, thread)}
			className={className}
		>
			{children}
		</div>
	);
}
