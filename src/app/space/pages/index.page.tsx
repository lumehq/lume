import { AddBlock } from "@app/space/components/add";
import { FeedBlock } from "@app/space/components/blocks/feed";
import { FollowingBlock } from "@app/space/components/blocks/following";
import { ImageBlock } from "@app/space/components/blocks/image";
import { ThreadBlock } from "@app/space/components/blocks/thread";
import { useActiveAccount } from "@stores/accounts";
import { useEffect } from "react";

export function Page() {
	const blocks = useActiveAccount((state: any) => state.blocks);
	const fetchBlocks = useActiveAccount((state: any) => state.fetchBlocks);

	useEffect(() => {
		if (blocks !== null) return;
		fetchBlocks();
	}, [fetchBlocks]);

	return (
		<div className="h-full w-full flex flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
			<FollowingBlock block={1} />
			{!blocks ? (
				<p>Loading...</p>
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
			<div className="shrink-0 w-[90px]">
				<div className="w-full h-full inline-flex items-center justify-center">
					<AddBlock />
				</div>
			</div>
			<div className="shrink-0 w-[360px]" />
		</div>
	);
}
