import { CancelIcon, HelpIcon } from "@lume/icons";
import { tutorialAtom } from "@lume/utils";
import * as Popover from "@radix-ui/react-popover";
import { useAtom } from "jotai";
import { TutorialRouter } from "./router";

export function TutorialModal() {
	const [tutorial, setTutorial] = useAtom(tutorialAtom);

	return (
		<Popover.Root open={tutorial}>
			<Popover.Trigger asChild>
				<button
					type="button"
					onClick={() => setTutorial((state) => !state)}
					className="inline-flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-black/50 size-10"
				>
					<HelpIcon className="size-5" />
				</button>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content className="relative right-4 bottom-8">
					<div className="flex flex-col w-full max-w-xs bg-white h-[480px] rounded-xl dark:bg-neutral-950 dark:border dark:border-neutral-900 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
						<div className="pt-5 mb-3 shrink-0 flex px-5 items-center justify-between text-neutral-500 dark:text-neutral-400">
							<h3 className="text-sm font-medium">Tutorial</h3>
							<Popover.Close onClick={() => setTutorial(false)}>
								<CancelIcon className="size-4" />
							</Popover.Close>
						</div>
						<div className="min-h-0 flex-1 h-full">
							<TutorialRouter />
						</div>
					</div>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
}
