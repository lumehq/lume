import { removeBlock } from "@libs/storage";
import { Image } from "@shared/image";
import { TitleBar } from "@shared/titleBar";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function ImageBlock({ params }: { params: any }) {
	const queryClient = useQueryClient();

	const block = useMutation({
		mutationFn: (id: string) => removeBlock(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blocks"] });
		},
	});

	return (
		<div className="shrink-0 w-[350px] h-full flex flex-col justify-between border-r border-zinc-900">
			<div className="flex-1 w-full h-full overflow-hidden p-3">
				<div className="w-full h-full">
					<Image
						src={params.content}
						fallback={DEFAULT_AVATAR}
						alt={params.title}
						className="w-full h-full object-cover rounded-xl border-t border-zinc-800/50"
					/>
				</div>
			</div>
		</div>
	);
}
