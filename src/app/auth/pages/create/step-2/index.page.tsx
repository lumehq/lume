import { AvatarUploader } from "@shared/avatarUploader";
import { LoaderIcon } from "@shared/icons";
import { Image } from "@shared/image";
import { useActiveAccount } from "@stores/accounts";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { navigate } from "vite-plugin-ssr/client/router";

export function Page() {
	const createTempProfile = useActiveAccount(
		(state: any) => state.createTempProfile,
	);

	const [image, setImage] = useState(DEFAULT_AVATAR);
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { isDirty, isValid },
	} = useForm();

	const onSubmit = (data: any) => {
		setLoading(true);
		try {
			const profile = { ...data, name: data.displayName };
			createTempProfile(profile);
			// redirect to step 3
			navigate("/app/auth/create/step-3", {
				overwriteLastHistoryEntry: true,
			});
		} catch {
			console.log("error");
		}
	};

	useEffect(() => {
		setValue("picture", image);
	}, [setValue, image]);

	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="mx-auto w-full max-w-md">
				<div className="mb-8 text-center">
					<h1 className="text-xl font-semibold text-zinc-100">
						Create your profile
					</h1>
				</div>
				<div className="w-full rounded-xl border-t border-zinc-800/50 bg-zinc-900 p-5">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<input
							type={"hidden"}
							{...register("picture")}
							value={image}
							className="relative h-10 w-full rounded-lg border border-black/5 px-3 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-black/10 dark:placeholder:text-zinc-500"
						/>
						<div className="flex flex-col gap-1">
							<label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
								Avatar
							</label>
							<div className="relative inline-flex h-36 w-full items-center justify-center overflow-hidden rounded-lg border border-zinc-900 bg-zinc-950">
								<Image
									src={image}
									alt="avatar"
									className="relative z-10 h-11 w-11 rounded-md"
								/>
								<div className="absolute bottom-3 right-3 z-10">
									<AvatarUploader valueState={setImage} />
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
								Display Name *
							</label>
							<input
								type={"text"}
								{...register("displayName", {
									required: true,
									minLength: 4,
								})}
								spellCheck={false}
								className="relative h-10 w-full rounded-lg px-3 py-2 !outline-none bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
								Bio
							</label>
							<textarea
								{...register("about")}
								spellCheck={false}
								className="resize-none relative h-20 w-full rounded-lg px-3 py-2 !outline-none bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
							/>
						</div>
						<div>
							<button
								type="submit"
								disabled={!isDirty || !isValid}
								className="inline-flex items-center justify-center h-11 w-full bg-fuchsia-500 rounded-md font-medium text-zinc-100 hover:bg-fuchsia-600"
							>
								{loading ? (
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
