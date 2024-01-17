import { ThreadNote } from "@lume/ark";
import { ArrowLeftIcon, ArrowRightIcon } from "@lume/icons";
import { useNavigate, useParams } from "react-router-dom";
import { WindowVirtualizer } from "virtua";
import { ReplyList } from "../replyList";

export function EventRoute() {
	const { id } = useParams();
	const navigate = useNavigate();

	return (
		<div className="pb-5 overflow-y-auto">
			<WindowVirtualizer>
				<div className="h-11 bg-neutral-50 dark:bg-neutral-950 border-b flex items-center justify-start gap-2 px-3 border-neutral-100 dark:border-neutral-900 mb-3">
					<button
						type="button"
						className="size-9 hover:bg-neutral-100 hover:text-blue-500 dark:hover:bg-neutral-900 rounded-lg inline-flex items-center justify-center"
						onClick={() => navigate(-1)}
					>
						<ArrowLeftIcon className="size-5" />
					</button>
					<button
						type="button"
						className="size-9 hover:bg-neutral-100 hover:text-blue-500 dark:hover:bg-neutral-900 rounded-lg inline-flex items-center justify-center"
						onClick={() => navigate(1)}
					>
						<ArrowRightIcon className="size-5" />
					</button>
				</div>
				<div className="px-3">
					<ThreadNote eventId={id} />
					<ReplyList eventId={id} />
				</div>
			</WindowVirtualizer>
		</div>
	);
}
