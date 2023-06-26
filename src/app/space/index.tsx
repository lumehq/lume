import { AddBlock } from "@app/space/components/add";
import { FeedBlock } from "@app/space/components/blocks/feed";
import { FollowingBlock } from "@app/space/components/blocks/following";
import { ImageBlock } from "@app/space/components/blocks/image";
import { ThreadBlock } from "@app/space/components/blocks/thread";
import { getBlocks } from "@libs/storage";
import { LoaderIcon } from "@shared/icons";
import { useQuery } from "@tanstack/react-query";

export function SpaceScreen() {
	const {
		status,
		data: blocks,
		isFetching,
	} = useQuery(
		["blocks"],
		async () => {
			return await getBlocks();
		},
		{
			staleTime: Infinity,
			refetchOnMount: false,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
		},
	);

	return (
		<div className="h-full w-full flex flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
			<FollowingBlock block={1} />
			{status === "loading" ? (
				<div className="shrink-0 w-[350px] flex-col flex border-r border-zinc-900">
					<div
						data-tauri-drag-region
						className="group overflow-hidden h-11 w-full flex items-center justify-between px-3 border-b border-zinc-900"
					/>

					<div className="w-full flex-1 flex items-center justify-center p-3">
						<LoaderIcon className="h-5 w-5 animate-spin text-black dark:text-zinc-100" />
					</div>
				</div>
			) : (
				blocks.map((block: any) => {
					switch (block.kind) {
						case 0:
							return <ImageBlock key={block.id} params={block} />;
						case 1:
							return <FeedBlock key={block.id} params={block} />;
						case 2:
							return <ThreadBlock key={block.id} params={block} />;
						default:
							break;
					}
				})
			)}
			{isFetching && (
				<div className="shrink-0 w-[350px] flex-col flex border-r border-zinc-900">
					<div
						data-tauri-drag-region
						className="group overflow-hidden h-11 w-full flex items-center justify-between px-3 border-b border-zinc-900"
					/>

					<div className="w-full flex-1 flex items-center justify-center p-3">
						<LoaderIcon className="h-5 w-5 animate-spin text-black dark:text-zinc-100" />
					</div>
				</div>
			)}
			<div className="shrink-0 w-[350px] flex-col flex border-r border-zinc-900">
				<div className="w-full h-full inline-flex items-center justify-center">
					<AddBlock />
				</div>
			</div>
			<div className="shrink-0 w-[350px]" />
		</div>
	);
}
