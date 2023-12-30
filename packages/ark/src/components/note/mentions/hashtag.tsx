import { COL_TYPES } from "@lume/utils";
import { useColumnContext } from "../../column";

export function Hashtag({ tag }: { tag: string }) {
	const { addColumn } = useColumnContext();

	return (
		<button
			type="button"
			onClick={() =>
				addColumn({
					kind: COL_TYPES.hashtag,
					title: tag,
					content: tag,
				})
			}
			className="cursor-default break-all text-blue-500 hover:text-blue-600"
		>
			{tag}
		</button>
	);
}
