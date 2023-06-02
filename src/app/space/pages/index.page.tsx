import { AddBlock } from "@app/space/components/add";
import { FeedBlock } from "@app/space/components/blocks/feed";
import { FollowingBlock } from "@app/space/components/blocks/following";
import { ImageBlock } from "@app/space/components/blocks/image";
import { useActiveAccount } from "@stores/accounts";
import { getBlocks } from "@utils/storage";
import useSWR from "swr";

const fetcher = ([, id]) => getBlocks(id);

export function Page() {
	const account = useActiveAccount((state: any) => state.account);
	const { data }: any = useSWR(
		account ? ["blocks", account.id] : null,
		fetcher,
	);

	return (
		<div className="h-full w-full flex flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
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
			<div className="shrink-0 w-[90px]">
				<div className="w-full h-full inline-flex items-center justify-center">
					<AddBlock />
				</div>
			</div>
			<div className="shrink-0 w-[360px]" />
		</div>
	);
}
