import { useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { useStorage } from "@lume/storage";
import NDK, { NDKNip46Signer, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { nip19 } from "nostr-tools";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function LoginWithNsecbunker() {
	const ark = useArk();
	const storage = useStorage();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isValid },
	} = useForm();

	const onSubmit = async (data: { npub: string }) => {
		try {
			if (!data.npub.startsWith("npub1"))
				return toast.info("You need to enter a token start with npub1");

			if (!data.npub.includes("#"))
				return toast.info("Token must include #secret");

			setLoading(true);

			const bunker = new NDK({
				explicitRelayUrls: [
					"wss://relay.nsecbunker.com",
					"wss://nostr.vulpem.com",
				],
			});
			await bunker.connect(2000);

			const pubkey = nip19.decode(data.npub.split("#")[0]).data as string;
			const localSigner = NDKPrivateKeySigner.generate();
			const remoteSigner = new NDKNip46Signer(bunker, data.npub, localSigner);
			await remoteSigner.blockUntilReady();

			ark.updateNostrSigner({ signer: remoteSigner });

			await storage.createSetting("nsecbunker", "1");
			const account = await storage.createAccount({
				pubkey: pubkey,
				privkey: localSigner.privateKey,
			});
			ark.account = account;

			return navigate("/auth/onboarding", { replace: true });
		} catch (e) {
			setLoading(false);
			setError("npub", {
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
						Enter your nsecbunker token
					</h1>
				</div>
				<div className="flex flex-col gap-6">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-4 mb-0"
					>
						<div className="relative flex flex-col gap-1">
							<input
								type="text"
								{...register("npub", { required: false })}
								spellCheck={false}
								autoCapitalize="none"
								autoCorrect="none"
								placeholder="npub1...#..."
								className="px-3 text-xl border-transparent rounded-xl h-14 bg-neutral-950 placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-800"
							/>
							{errors.npub && (
								<p className="text-sm text-center text-red-600">
									{errors.npub.message as string}
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
								"Continue"
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
