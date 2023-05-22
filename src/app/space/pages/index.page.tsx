import { FeedBlock } from "../components/feed";
import { CreateBlockModal } from "@app/space/components/create";
import { FollowingBlock } from "@app/space/components/following";
import { ImageBlock } from "@app/space/components/image";
import { getBlocks } from "@utils/storage";
import useSWR from "swr";

const fetcher = ([, id]) => getBlocks(1);

export function Page() {
	const { data }: any = useSWR("blocks", fetcher);

	return (
		<div className="h-full w-full flex flex-nowrap overflow-x-auto overflow-y-hidden">
			<FollowingBlock />
			{data
				? data.map((block: any) =>
						block.kind === 0 ? (
							<ImageBlock key={block.id} params={block} />
						) : (
							<FeedBlock key={block.id} params={block} />
						),
				  )
				: null}
			<div className="shrink-0 w-[360px] border-r border-zinc-900">
				<div className="w-full h-full inline-flex items-center justify-center">
					<CreateBlockModal />
				</div>
			</div>
			<div className="shrink-0 w-[360px]" />
		</div>
	);
}
