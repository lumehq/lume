import { ThreadNote } from "@lume/ark";
import { ArrowLeftIcon } from "@lume/icons";
import { ReplyList } from "@lume/ui";
import { useNavigate, useParams } from "react-router-dom";
import { WVList } from "virtua";

export function EventRoute() {
	const { id } = useParams();
	const navigate = useNavigate();

	return (
		<WVList className="pb-5 overflow-y-auto">
			<div className="flex items-center px-3 mb-3 border-b h-11 bg-neutral-50 dark:bg-neutral-950 border-neutral-100 dark:border-neutral-900">
				<button
					type="button"
					className="inline-flex items-center gap-2.5 text-sm font-medium"
					onClick={() => navigate(-1)}
				>
					<ArrowLeftIcon className="size-4" />
					Back
				</button>
			</div>
			<div className="px-3">
				<ThreadNote eventId={id} />
				<ReplyList eventId={id} title="All replies" className="mt-5" />
			</div>
		</WVList>
	);
}
