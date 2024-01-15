import { tutorialAtom } from "@lume/utils";
import { useSetAtom } from "jotai";

export function TutorialFinishScreen() {
	const tutorial = useSetAtom(tutorialAtom);

	return (
		<div className="px-5 h-full flex flex-col justify-between">
			<div className="h-full min-h-0 flex flex-col gap-2">
				<p>
					<span className="font-semibold">Great Job!</span> You have completed
					this section. Feel free to explore other menus in the interface, such
					as Activity and Relay Explorer.
				</p>
				<p>
					If you want to see this tutorial again, don't hesitate to press the ?
					icon in Bottom bar
				</p>
				<p>
					If you want to seek help from Lume Devs, you can publish a post with{" "}
					<span className="text-blue-500">#lumesos</span>
				</p>
			</div>
			<div className="h-16 w-full shrink-0 flex items-center justify-end">
				<button
					type="button"
					onClick={() => tutorial(false)}
					className="inline-flex items-center justify-center w-20 font-semibold border-t rounded-lg border-neutral-900 dark:border-neutral-800 h-9 bg-neutral-950 text-neutral-50 dark:bg-neutral-900 hover:bg-neutral-900 dark:hover:bg-neutral-800"
				>
					Finish
				</button>
			</div>
		</div>
	);
}
