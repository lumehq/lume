import { CancelIcon } from "@shared/icons";
import { Image } from "@shared/image";
import { useActiveAccount } from "@stores/accounts";

export function ImageBlock({ params }: { params: any }) {
	const removeBlock = useActiveAccount((state: any) => state.removeBlock);

	const close = () => {
		removeBlock(params.id, true);
	};

	return (
		<div className="shrink-0 w-[350px] flex-col flex border-r border-zinc-900">
			<div
				data-tauri-drag-region
				className="h-11 w-full flex items-center justify-between px-3 border-b border-zinc-900"
			>
				<div className="w-9 h-6" />
				<h3 className="font-semibold text-zinc-100">{params.title}</h3>
				<button
					type="button"
					onClick={() => close()}
					className="inline-flex h-7 w-7 shrink items-center justify-center rounded bg-zinc-900 hover:bg-zinc-800"
				>
					<CancelIcon width={14} height={14} className="text-zinc-500" />
				</button>
			</div>
			<div className="w-full flex-1 p-3">
				<Image
					src={params.content}
					alt={params.title}
					className="w-full h-full object-cover rounded-md"
				/>
			</div>
		</div>
	);
}
