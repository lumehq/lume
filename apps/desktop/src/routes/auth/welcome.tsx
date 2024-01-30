import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function WelcomeScreen() {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col items-center justify-between w-full h-full">
			<div />
			<div className="flex flex-col items-center w-full max-w-4xl gap-10 mx-auto">
				<div className="flex flex-col items-center text-center">
					<img
						src="/heading.png"
						srcSet="/heading@2x.png 2x"
						alt="lume"
						className="w-2/3"
					/>
					<p className="mt-5 text-lg whitespace-pre-line font-medium leading-snug text-neutral-600 dark:text-neutral-500">
						{t("welcome.title")}
					</p>
				</div>
				<div className="flex flex-col w-full max-w-xs gap-2 mx-auto">
					<Link
						to="/auth/create"
						className="inline-flex items-center justify-center w-full h-12 text-lg font-medium text-white bg-blue-500 rounded-xl hover:bg-blue-600"
					>
						{t("welcome.signup")}
					</Link>
					<Link
						to="/auth/login"
						className="inline-flex items-center justify-center w-full h-12 text-lg font-medium text-neutral-50 rounded-xl bg-neutral-950 hover:bg-neutral-900"
					>
						{t("welcome.login")}
					</Link>
				</div>
			</div>
			<div className="flex items-center justify-center h-11">
				<p className="text-neutral-700">
					{t("welcome.footer")}{" "}
					<Link
						to="https://nostr.com"
						target="_blank"
						className="text-blue-500"
					>
						here
					</Link>
				</p>
			</div>
		</div>
	);
}
