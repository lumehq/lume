import { LoaderIcon } from "@shared/icons";
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
					<h1 className="text-xl font-semibold text-zinc-100">
						Import your key
					</h1>
				</div>
				<div className="flex flex-col gap-4">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-3"
					>
						<div className="flex flex-col gap-0.5">
							<input
								{...register("key", { required: true, minLength: 32 })}
								type={"password"}
								placeholder="Paste private key here..."
								className="relative w-full rounded-lg px-3 py-3 !outline-none bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
							/>
							<span className="text-base text-red-400">
								{errors.key && <p>{errors.key.message}</p>}
							</span>
						</div>
						<div className="flex items-center justify-center">
							<button
								type="submit"
								disabled={!isDirty || !isValid}
								className="inline-flex items-center justify-center h-11 w-full bg-fuchsia-500 rounded-md font-medium text-zinc-100 hover:bg-fuchsia-600"
							>
								{isSubmitting ? (
									<LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-zinc-100" />
								) : (
									"Continue →"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
