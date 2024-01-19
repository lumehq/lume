import { onboardingAtom } from "@lume/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { useAtomValue } from "jotai";
import { OnboardingRouter } from "./router";

export function OnboardingModal() {
	const onboarding = useAtomValue(onboardingAtom);

	return (
		<Dialog.Root open={onboarding}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm dark:bg-white/10" />
				<Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center min-h-full">
					<div
						data-tauri-drag-region
						className="h-20 absolute top-0 left-0 w-full"
					/>
					<div className="relative w-full max-w-xl xl:max-w-2xl bg-white h-[600px] xl:h-[700px] rounded-xl dark:bg-black overflow-hidden">
						<OnboardingRouter />
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
