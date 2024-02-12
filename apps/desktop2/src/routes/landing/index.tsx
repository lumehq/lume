import { useStorage } from "@lume/storage";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/landing/")({
	component: Index,
});

function Index() {
	const storage = useStorage();
	const { t } = useTranslation();

	return (
		<div className="flex flex-col w-screen h-screen bg-black">
			<div className="flex flex-col items-center justify-between w-full h-full">
				<div />
				<div className="flex flex-col items-center w-full max-w-4xl gap-10 mx-auto">
					<div className="flex flex-col items-center text-center">
						<img
							src={`/heading-${storage.locale}.png`}
							srcSet={`/heading-${storage.locale}@2x.png 2x`}
							alt="lume"
							className="w-2/3"
						/>
						<p className="mt-5 text-lg font-medium leading-snug whitespace-pre-line text-gray-7">
							{t("welcome.title")}
						</p>
					</div>
					<div className="flex flex-col w-full max-w-xs gap-2 mx-auto">
						<Link
							to="/auth/create"
							className="inline-flex items-center justify-center w-full h-12 text-lg font-medium text-white bg-blue-10 rounded-xl hover:bg-blue-11"
						>
							{t("welcome.signup")}
						</Link>
						<Link
							to="/auth/import"
							className="inline-flex items-center justify-center w-full h-12 text-lg font-medium text-white rounded-xl bg-gray-12 hover:bg-gray-11"
						>
							{t("welcome.login")}
						</Link>
					</div>
				</div>
				<div className="flex items-center justify-center h-11">
					<p className="text-gray-8">
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
		</div>
	);
}
