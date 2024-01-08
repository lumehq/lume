import { CheckIcon } from "@lume/icons";
import { onboardingAtom } from "@lume/utils";
import { motion } from "framer-motion";
import { useSetAtom } from "jotai";

export function OnboardingFinishScreen() {
	const setOnboarding = useSetAtom(onboardingAtom);

	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="w-full h-full flex flex-col gap-2 items-center justify-center"
		>
			<CheckIcon className="size-12 text-teal-500" />
			<div className="text-center">
				<p className="text-lg font-medium">Profile setup complete!</p>
				<p className="leading-tight text-neutral-600 dark:text-neutral-400">
					You can exit the setup here and start using Lume.
				</p>
			</div>
			<div className="mt-4 flex flex-col gap-2 items-center">
				<button
					type="button"
					onClick={() => setOnboarding(false)}
					className="inline-flex items-center justify-center gap-2 w-44 font-medium h-11 rounded-xl bg-blue-100 text-blue-500 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-500 dark:hover:bg-blue-800"
				>
					Close
				</button>
				<a
					href="https://github.com/luminous-devs/lume/issues"
					target="_blank"
					className="inline-flex items-center justify-center gap-2 w-44 px-5 font-medium h-11 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-600"
					rel="noreferrer"
				>
					Report a issue
				</a>
			</div>
		</motion.div>
	);
}
