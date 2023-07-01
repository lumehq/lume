import { AvatarUploader } from "@shared/avatarUploader";
import { BannerUploader } from "@shared/bannerUploader";
import { LoaderIcon } from "@shared/icons";
import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useOnboarding } from "@stores/onboarding";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export function CreateStep2Screen() {
	const navigate = useNavigate();
	const createProfile = useOnboarding((state: any) => state.createProfile);

	const [picture, setPicture] = useState(DEFAULT_AVATAR);
	const [banner, setBanner] = useState("");
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { isDirty, isValid },
	} = useForm();

	const onSubmit = (data: any) => {
		setLoading(true);
		try {
			const profile = {
				...data,
				username: data.name,
				display_name: data.name,
				bio: data.about,
			};
			createProfile(profile);
			// redirect to next step
			setTimeout(
				() => navigate("/auth/create/step-3", { replace: true }),
				1200,
			);
		} catch {
			console.log("error");
		}
	};

	return (
		<div className="mx-auto w-full max-w-md">
			<div className="mb-8 text-center">
				<h1 className="text-xl font-semibold text-zinc-100">
					Create your profile
				</h1>
			</div>
			<div className="w-full rounded-xl border-t border-zinc-800/50 bg-zinc-900 overflow-hidden">
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mb-0">
					<input
						type={"hidden"}
						{...register("picture")}
						value={picture}
						className="relative h-10 w-full rounded-lg border border-black/5 px-3 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-black/10 dark:placeholder:text-zinc-500"
					/>
					<input
						type={"hidden"}
						{...register("banner")}
						value={banner}
						className="relative h-10 w-full rounded-lg border border-black/5 px-3 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-black/10 dark:placeholder:text-zinc-500"
					/>
					<div className="relative">
						<div className="relative w-full h-44 bg-zinc-800">
							<Image
								src={banner}
								fallback="https://void.cat/d/QY1myro5tkHVs2nY7dy74b.jpg"
								alt="user's banner"
								className="h-full w-full object-cover"
							/>
							<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full h-full">
								<BannerUploader setBanner={setBanner} />
							</div>
						</div>
						<div className="px-4 mb-5">
							<div className="z-10 relative h-14 w-14 -mt-7">
								<Image
									src={picture}
									fallback={DEFAULT_AVATAR}
									alt="user's avatar"
									className="h-14 w-14 object-cover ring-2 ring-zinc-900 rounded-lg"
								/>
								<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full h-full">
									<AvatarUploader setPicture={setPicture} />
								</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-4 px-4 pb-4">
						<div className="flex flex-col gap-1">
							<label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
								Name *
							</label>
							<input
								type={"text"}
								{...register("name", {
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
						<div className="flex flex-col gap-1">
							<label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
								Website
							</label>
							<input
								type={"text"}
								{...register("website", {
									required: false,
								})}
								spellCheck={false}
								className="relative h-10 w-full rounded-lg px-3 py-2 !outline-none bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
							/>
						</div>
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
	);
}
