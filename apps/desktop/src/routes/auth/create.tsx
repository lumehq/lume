import { LoaderIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function CreateAccountScreen() {
	const navigate = useNavigate();

	const [t] = useTranslation();
	const [method, setMethod] = useState<"self" | "managed">("self");
	const [loading, setLoading] = useState(false);

	const next = () => {
		setLoading(true);

		if (method === "self") {
			navigate("/auth/create-keys");
		} else {
			navigate("/auth/create-address");
		}
	};

	return (
		<div className="relative flex items-center justify-center w-full h-full">
			<div className="flex flex-col w-full max-w-md gap-8 mx-auto">
				<div className="flex flex-col gap-1 text-center items-center">
					<h1 className="text-2xl font-semibold">{t("signup.title")}</h1>
					<p className="text-lg font-medium leading-snug text-neutral-600 dark:text-neutral-500">
						{t("signup.subtitle")}
					</p>
				</div>
				<div className="flex flex-col gap-4">
					<button
						type="button"
						onClick={() => setMethod("self")}
						className={cn(
							"flex flex-col items-start px-4 py-3.5 bg-neutral-900 rounded-xl hover:bg-neutral-800",
							method === "self" ? "ring-1 ring-teal-500" : "",
						)}
					>
						<p className="font-semibold">{t("signup.selfManageMethod")}</p>
						<p className="text-sm font-medium text-neutral-500">
							{t("signup.selfManageMethodDescription")}
						</p>
					</button>
					<button
						type="button"
						onClick={() => setMethod("managed")}
						className={cn(
							"flex flex-col items-start px-4 py-3.5 bg-neutral-900 rounded-xl hover:bg-neutral-800",
							method === "managed" ? "ring-1 ring-teal-500" : "",
						)}
					>
						<p className="font-semibold">{t("signup.providerMethod")}</p>
						<p className="text-sm font-medium text-neutral-500">
							{t("signup.providerMethodDescription")}
						</p>
					</button>
					<button
						type="button"
						onClick={next}
						className="inline-flex items-center justify-center w-full h-12 text-lg font-medium text-white bg-blue-500 rounded-xl hover:bg-blue-600"
					>
						{loading ? (
							<LoaderIcon className="size-5 animate-spin" />
						) : (
							t("global.continue")
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
