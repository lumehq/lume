import { CancelIcon } from "@shared/icons";
import { Image } from "@shared/image";
import { TitleBar } from "@shared/titleBar";
import { useActiveAccount } from "@stores/accounts";

export function ImageBlock({ params }: { params: any }) {
	const removeBlock = useActiveAccount((state: any) => state.removeBlock);

	const close = () => {
		removeBlock(params.id, true);
	};

	return (
		<div className="shrink-0 w-[350px] flex-col flex border-r border-zinc-900">
			<TitleBar title={params.title} onClick={() => close()} />
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
