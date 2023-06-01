import { Image } from "@shared/image";

export function ImageBlock({ params }: { params: any }) {
	return (
		<div className="shrink-0 w-[360px] flex-col flex border-r border-zinc-900">
			<div
				data-tauri-drag-region
				className="h-11 w-full inline-flex items-center justify-center border-b border-zinc-900"
			>
				<h3 className="font-semibold text-zinc-100">{params.title}</h3>
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
