import { useActiveAccount } from "@stores/accounts";
import { getPublicKey, nip19 } from "nostr-tools";
import { Resolver, useForm } from "react-hook-form";
import { navigate } from "vite-plugin-ssr/client/router";

type FormValues = {
	key: string;
};

const resolver: Resolver<FormValues> = async (values) => {
	return {
		values: values.key ? values : {},
		errors: !values.key
			? {
					key: {
						type: "required",
						message: "This is required.",
					},
			  }
			: {},
	};
};

export function Page() {
	const createAccount = useActiveAccount((state: any) => state.create);
	const {
		register,
		setError,
		handleSubmit,
		formState: { errors, isDirty, isValid, isSubmitting },
	} = useForm<FormValues>({ resolver });

	const onSubmit = async (data: any) => {
		try {
			let privkey = data["key"];

			if (privkey.substring(0, 4) === "nsec") {
				privkey = nip19.decode(privkey).data;
			}

			if (typeof getPublicKey(privkey) === "string") {
				const pubkey = getPublicKey(privkey);
				const npub = nip19.npubEncode(pubkey);

				createAccount(npub, pubkey, privkey, null, 1);
				navigate("/app/auth/import/step-2");
			}
		} catch (error) {
			setError("key", {
				type: "custom",
				message: "Private Key is invalid, please check again",
			});
		}
	};

	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="mx-auto w-full max-w-md">
				<div className="mb-8 text-center">
					<h1 className="text-xl font-semibold text-white">Import your key</h1>
				</div>
				<div className="flex flex-col gap-4">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-3"
					>
						<div className="flex flex-col gap-0.5">
							<div className="relative shrink-0 before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-fuchsia-500/100 dark:focus-within:after:shadow-fuchsia-500/20">
								<input
									{...register("key", { required: true, minLength: 32 })}
									type={"password"}
									placeholder="Paste private key here..."
									className="relative w-full rounded-lg border border-black/5 px-3.5 py-2.5 text-center shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-white dark:shadow-black/10 dark:placeholder:text-zinc-500"
								/>
							</div>
							<span className="text-base text-red-400">
								{errors.key && <p>{errors.key.message}</p>}
							</span>
						</div>
						<div className="flex h-9 items-center justify-center">
							{isSubmitting ? (
								<svg
									className="h-5 w-5 animate-spin text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<title id="loading">Loading</title>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
							) : (
								<button
									type="submit"
									disabled={!isDirty || !isValid}
									className="w-full transform rounded-lg bg-fuchsia-500 px-3.5 py-2.5 font-medium text-white shadow-button hover:bg-fuchsia-600 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
								>
									<span className="drop-shadow-lg">Continue →</span>
								</button>
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
