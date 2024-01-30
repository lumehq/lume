import { ArrowRightIcon, PopperFilledIcon } from "@lume/icons";
import { onboardingAtom } from "@lume/utils";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function OnboardingHomeScreen() {
	const navigate = useNavigate();

	const [t] = useTranslation();
	const [onboarding, setOnboarding] = useAtom(onboardingAtom);

	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="w-full h-full flex flex-col gap-2 items-center justify-center"
		>
			<PopperFilledIcon className="size-12 text-blue-500" />
			<div className="text-center">
				<p className="text-lg font-medium">{t("onboarding.home.title")}</p>
				<p className="leading-tight text-neutral-600 dark:text-neutral-400">
					{t("onboarding.home.subtitle")}
				</p>
			</div>
			<div className="mt-4 flex flex-col gap-2 items-center">
				<button
					type="button"
					onClick={() =>
						onboarding.newUser ? navigate("/profile") : navigate("/interests")
					}
					className="inline-flex items-center justify-center gap-2 w-44 font-medium h-11 rounded-xl bg-blue-100 text-blue-500 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-500 dark:hover:bg-blue-800"
				>
					{t("onboarding.home.profileSettings")}
					<ArrowRightIcon className="size-4" />
				</button>
				<button
					type="button"
					onClick={() => setOnboarding({ open: false, newUser: false })}
					className="inline-flex items-center justify-center gap-2 w-44 px-5 font-medium h-11 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-600"
				>
					{t("global.skip")}
				</button>
			</div>
		</motion.div>
	);
}
