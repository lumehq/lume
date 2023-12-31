import { COL_TYPES } from "@lume/utils";
import { useColumnContext } from "../../column";

export function Hashtag({ tag }: { tag: string }) {
	const { addColumn } = useColumnContext();

	return (
		<button
			type="button"
			onClick={async () =>
				await addColumn({
					kind: COL_TYPES.hashtag,
					title: tag,
					content: tag,
				})
			}
			className="text-blue-500 break-all cursor-default hover:text-blue-600"
		>
			{tag}
		</button>
	);
}
