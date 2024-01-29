import { useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { useStorage } from "@lume/storage";
import { NIP05 } from "@lume/types";
import NDK, { NDKNip46Signer, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { Window } from "@tauri-apps/api/window";
import { fetch } from "@tauri-apps/plugin-http";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export function LoginWithOAuth() {
	const ark = useArk();
	const storage = useStorage();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);

	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isValid },
	} = useForm();

	const onSubmit = async (data: { nip05: string }) => {
		try {
			setLoading(true);

			if (!emailRegex.test(data.nip05)) {
				setLoading(false);
				return toast.error(
					"Cannot verify your NIP-05 address, please try again later.",
				);
			}

			const localPath = data.nip05.split("@")[0];
			const service = data.nip05.split("@")[1];

			const verifyURL = `https://${service}/.well-known/nostr.json?name=${localPath}`;

			const req = await fetch(verifyURL, {
				method: "GET",
				headers: {
					"Content-Type": "application/json; charset=utf-8",
				},
			});

			if (!req.ok) {
				setLoading(false);
				return toast.error(
					"Cannot verify your NIP-05 address, please try again later.",
				);
			}

			const res: NIP05 = await req.json();

			if (!res.names[localPath.toLowerCase()] || !res.names[localPath]) {
				setLoading(false);
				return toast.error(
					"Cannot verify your NIP-05 address, please try again later.",
				);
			}

			const pubkey =
				(res.names[localPath] as string) ||
				(res.names[localPath.toLowerCase()] as string);

			if (!res.nip46[pubkey]) {
				setLoading(false);
				return toast.error("Cannot found NIP-46 with this address");
			}

			const nip46Relays = res.nip46[pubkey] as unknown as string[];

			const bunker = new NDK({
				explicitRelayUrls: nip46Relays || [
					"wss://relay.nsecbunker.com",
					"wss://nostr.vulpem.com",
				],
			});
			await bunker.connect(2000);

			const localSigner = NDKPrivateKeySigner.generate();
			const remoteSigner = new NDKNip46Signer(bunker, pubkey, localSigner);

			// handle auth url request
			let authWindow: Window;
			remoteSigner.addListener("authUrl", (authUrl: string) => {
				authWindow = new Window(`auth-${pubkey}`, {
					url: authUrl,
					title: "Login",
					titleBarStyle: "overlay",
					width: 415,
					height: 600,
					center: true,
					closable: false,
				});
			});

			const remoteUser = await remoteSigner.blockUntilReady();

			if (remoteUser) {
				authWindow.close();

				ark.updateNostrSigner({ signer: remoteSigner });

				await storage.createSetting("nsecbunker", "1");
				const account = await storage.createAccount({
					pubkey,
					privkey: localSigner.privateKey,
				});
				ark.account = account;

				return navigate("/auth/onboarding", { replace: true });
			}
		} catch (e) {
			setLoading(false);
			setError("nip05", {
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
						{t("loginWithAddress.title")}
					</h1>
				</div>
				<div className="flex flex-col gap-6">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-4 mb-0"
					>
						<div className="relative flex flex-col gap-1">
							<input
								type="email"
								{...register("nip05", { required: false })}
								spellCheck={false}
								autoCapitalize="none"
								autoCorrect="none"
								placeholder="satoshi@nostr.me"
								className="px-3 text-xl border-transparent rounded-xl h-14 bg-neutral-950 placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-800"
							/>
							{errors.nip05 && (
								<p className="text-sm text-center text-red-600">
									{errors.nip05.message as string}
								</p>
							)}
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
