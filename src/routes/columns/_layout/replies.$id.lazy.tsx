import { ReplyNote } from "@/components";
import { ArrowLeft } from "@phosphor-icons/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import {
	createLazyFileRoute,
	useRouter,
	useRouterState,
} from "@tanstack/react-router";
import { useRef } from "react";
import { Virtualizer } from "virtua";

export const Route = createLazyFileRoute("/columns/_layout/replies/$id")({
	component: Screen,
});

function Screen() {
	const router = useRouter();
	const ref = useRef<HTMLDivElement>(null);
	const { events } = useRouterState({ select: (s) => s.location.state });

	return (
		<div className="px-3 h-full">
			<div className="size-full bg-white dark:bg-black rounded-t-xl shadow shadow-neutral-300/50 dark:shadow-none border-[.5px] border-neutral-300 dark:border-neutral-700">
				<div className="h-full flex flex-col">
					<div className="h-10 shrink-0 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-2">
						<button
							type="button"
							onClick={() => router.history.back()}
							className="inline-flex items-center justify-center gap-1.5 h-7 w-max px-1 text-sm font-semibold hover:bg-black/10 dark:hover:bg-white/10 rounded-md"
						>
							<ArrowLeft className="size-4" />
							Back
						</button>
					</div>
					<ScrollArea.Root
						type={"scroll"}
						scrollHideDelay={300}
						className="overflow-hidden size-full flex-1"
					>
						<ScrollArea.Viewport ref={ref} className="h-full p-3">
							<Virtualizer scrollRef={ref}>
								{events.map((event) => (
									<ReplyNote key={event.id} event={event} />
								))}
							</Virtualizer>
						</ScrollArea.Viewport>
						<ScrollArea.Scrollbar
							className="flex select-none touch-none p-0.5 duration-[160ms] ease-out data-[orientation=vertical]:w-2"
							orientation="vertical"
						>
							<ScrollArea.Thumb className="flex-1 bg-black/10 dark:bg-white/10 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
						</ScrollArea.Scrollbar>
						<ScrollArea.Corner className="bg-transparent" />
					</ScrollArea.Root>
				</div>
			</div>
		</div>
	);
}
