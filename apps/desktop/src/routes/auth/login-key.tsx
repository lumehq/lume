import { useArk } from "@lume/ark";
import { EyeOffIcon, EyeOnIcon, LoaderIcon } from "@lume/icons";
import { useStorage } from "@lume/storage";
import { getPublicKey, nip19 } from "nostr-tools";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function LoginWithKey() {
	const ark = useArk();
	const storage = useStorage();
	const navigate = useNavigate();

	const [showKey, setShowKey] = useState(false);
	const [loading, setLoading] = useState(false);

	const { t } = useTranslation("loginWithPrivkey.subtitle");
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isValid },
	} = useForm();

	const onSubmit = async (data: { nsec: string }) => {
		try {
			if (!data.nsec.startsWith("nsec1"))
				return toast.error("You need to enter a private key start with nsec1");

			setLoading(true);

			const privkey = nip19.decode(data.nsec).data as string;
			const pubkey = getPublicKey(privkey);

			const account = await storage.createAccount({
				pubkey: pubkey,
				privkey: privkey,
			});
			ark.account = account;

			return navigate("/auth/onboarding", { replace: true });
		} catch (e) {
			setLoading(false);
			setError("nsec", {
				type: "manual",
				message: String(e),
			});
		}
	};

	return (
		<div className="relative flex items-center justify-center w-full h-full">
			<div className="flex flex-col w-full max-w-md gap-8 mx-auto">
				<div className="flex flex-col gap-1 text-center items-center">
					<h1 className="text-2xl font-semibold">
						{t("loginWithPrivkey.title")}
					</h1>
					<Trans
						t={t}
						className="text-lg font-medium whitespace-pre-line leading-snug text-neutral-600 dark:text-neutral-500"
					>
						Lume will put your private key to
						<span className="text-teal-500">
							{storage.platform === "macos"
								? "Apple Keychain"
								: storage.platform === "windows"
								  ? "Credential Manager"
								  : "Secret Service"}
						</span>
						. It will be secured by your OS.
					</Trans>
				</div>
				<div className="flex flex-col gap-6">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-4 mb-0"
					>
						<div className="relative flex flex-col gap-1">
							<input
								type={showKey ? "text" : "password"}
								{...register("nsec", { required: false })}
								spellCheck={false}
								autoCapitalize="none"
								autoCorrect="none"
								placeholder="nsec1..."
								className="pl-3 pr-11 text-xl border-transparent rounded-xl h-14 bg-neutral-950 placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-800"
							/>
							{errors.nsec && (
								<p className="text-sm text-center text-red-600">
									{errors.nsec.message as string}
								</p>
							)}
							<button
								type="button"
								onClick={() => setShowKey((state) => !state)}
								className="absolute right-2 top-2 size-10 inline-flex items-center justify-center rounded-lg text-white bg-neutral-900 hover:bg-neutral-800"
							>
								{showKey ? (
									<EyeOnIcon className="size-5" />
								) : (
									<EyeOffIcon className="size-5" />
								)}
							</button>
						</div>
						<button
							type="submit"
							disabled={!isValid || loading}
							className="inline-flex items-center justify-center w-full text-lg h-12 font-medium text-white bg-blue-500 rounded-xl hover:bg-blue-600 disabled:opacity-50"
						>
							{loading ? (
								<LoaderIcon className="size-5 animate-spin" />
							) : (
								t("global.continue")
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
