import { Timeline } from "@columns/timeline";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	PlusIcon,
	PlusSquareIcon,
} from "@lume/icons";
import { useColumn } from "@lume/storage";
import * as Tooltip from "@radix-ui/react-tooltip";
import { t } from "i18next";
import { VList } from "virtua";

export function HomeScreen() {
	const { vlistRef } = useColumn();

	return (
		<div className="relative w-full h-full">
			<VList
				ref={vlistRef}
				className="h-full w-full flex-nowrap overflow-x-auto !overflow-y-hidden scrollbar-none focus:outline-none"
				itemSize={420}
				tabIndex={0}
				horizontal
			>
				<Timeline column={{ id: 1, title: "", content: "" }} />
				<div className="w-[420px] h-full flex items-center justify-center">
					<button
						type="button"
						className="size-16 inline-flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-2xl"
					>
						<PlusIcon className="size-6" />
					</button>
				</div>
			</VList>
			<Tooltip.Provider>
				<div className="absolute bottom-3 right-3">
					<div className="flex items-center gap-1 p-1 bg-black/50 dark:bg-white/30 backdrop-blur-xl rounded-xl shadow-toolbar">
						<Tooltip.Root delayDuration={150}>
							<Tooltip.Trigger asChild>
								<button
									type="button"
									className="inline-flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-black/30 size-10"
								>
									<ArrowLeftIcon className="size-5" />
								</button>
							</Tooltip.Trigger>
							<Tooltip.Portal>
								<Tooltip.Content className="inline-flex h-7 select-none text-neutral-50 dark:text-neutral-950 items-center justify-center rounded-md bg-neutral-950 dark:bg-neutral-50 px-3.5 text-sm will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
									{t("global.moveLeft")}
									<Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
								</Tooltip.Content>
							</Tooltip.Portal>
						</Tooltip.Root>
						<Tooltip.Root delayDuration={150}>
							<Tooltip.Trigger asChild>
								<button
									type="button"
									className="inline-flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-black/30 size-10"
								>
									<ArrowRightIcon className="size-5" />
								</button>
							</Tooltip.Trigger>
							<Tooltip.Portal>
								<Tooltip.Content className="inline-flex h-7 select-none text-neutral-50 dark:text-neutral-950 items-center justify-center rounded-md bg-neutral-950 dark:bg-neutral-50 px-3.5 text-sm will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
									{t("global.moveRight")}
									<Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
								</Tooltip.Content>
							</Tooltip.Portal>
						</Tooltip.Root>
						<Tooltip.Root delayDuration={150}>
							<Tooltip.Trigger asChild>
								<button
									type="button"
									className="inline-flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-black/30 size-10"
								>
									<PlusSquareIcon className="size-5" />
								</button>
							</Tooltip.Trigger>
							<Tooltip.Portal>
								<Tooltip.Content className="inline-flex h-7 select-none text-neutral-50 dark:text-neutral-950 items-center justify-center rounded-md bg-neutral-950 dark:bg-neutral-50 px-3.5 text-sm will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
									{t("global.newColumn")}
									<Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
								</Tooltip.Content>
							</Tooltip.Portal>
						</Tooltip.Root>
						<div className="w-px h-6 bg-white/10" />
					</div>
				</div>
			</Tooltip.Provider>
		</div>
	);
}
