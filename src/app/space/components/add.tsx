import { AddFeedBlock } from "@app/space/components/addFeed";
import { AddImageBlock } from "@app/space/components/addImage";

export function AddBlock() {
	return (
		<div className="flex flex-col gap-1">
			<AddImageBlock />
			<AddFeedBlock />
		</div>
	);
}
