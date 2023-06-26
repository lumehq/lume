import { removeBlock } from "@libs/storage";
import { CancelIcon } from "@shared/icons";
import { Image } from "@shared/image";
import { TitleBar } from "@shared/titleBar";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function ImageBlock({ params }: { params: any }) {
	const queryClient = useQueryClient();

	const block = useMutation({
		mutationFn: (id: string) => {
			return removeBlock(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blocks"] });
		},
	});

	return (
		<div className="shrink-0 w-[350px] h-full flex flex-col justify-between border-r border-zinc-900">
			<div className="relative flex-1 w-full h-full p-3 overflow-hidden">
				<div className="absolute top-3 left-0 w-full h-16 px-3">
					<div className="h-16 rounded-t-xl overflow-hidden flex items-center justify-between px-5">
						<h3 className="text-white font-medium drop-shadow-lg">
							{params.title}
						</h3>
						<button
							type="button"
							onClick={() => block.mutate(params.id)}
							className="inline-flex h-7 w-7 rounded-md items-center justify-center bg-white/30 backdrop-blur-lg"
						>
							<CancelIcon width={16} height={16} className="text-white" />
						</button>
					</div>
				</div>
				<Image
					src={params.content}
					fallback={DEFAULT_AVATAR}
					alt={params.title}
					className="w-full h-full object-cover rounded-xl border-t border-zinc-800/50"
				/>
			</div>
		</div>
	);
}
