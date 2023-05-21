import { FollowingBlock } from "@app/space/components/following";
import PlusIcon from "@shared/icons/plus";

export function Page() {
	return (
		<div className="h-full w-full flex flex-nowrap overflow-x-auto overflow-y-hidden">
			<FollowingBlock />
			<div className="shrink-0 w-[360px] border-r border-zinc-900">
				<div className="w-full h-full inline-flex items-center justify-center">
					<button
						type="button"
						className="inline-flex flex-col items-center justify-center gap-1 text-zinc-500 text-lg font-semibold"
					>
						<PlusIcon className="w-5 h-5 text-zinc-300" />
						Add block
					</button>
				</div>
			</div>
			<div className="shrink-0 w-[360px]" />
		</div>
	);
}
