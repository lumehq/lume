import { useArk } from "@lume/ark";
import { CheckCircleIcon, LoaderIcon, UnverifiedIcon } from "@lume/icons";
import { useStorage } from "@lume/storage";
import { NDKKind, NDKUserProfile } from "@nostr-dev-kit/ndk";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AvatarUpload } from "./components/avatarUpload";
import { CoverUpload } from "./components/coverUpload";

export function ProfileSettingScreen() {
	const ark = useArk();
	const storage = useStorage();
	const queryClient = useQueryClient();

	const [loading, setLoading] = useState(false);
	const [picture, setPicture] = useState("");
	const [banner, setBanner] = useState("");
	const [nip05, setNIP05] = useState({ verified: true, text: "" });

	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		setError,
		formState: { isValid, errors },
	} = useForm({
		defaultValues: async () => {
			const res: NDKUserProfile = queryClient.getQueryData([
				"user",
				ark.account.pubkey,
			]);
			if (res.image) {
				setPicture(res.image);
			}
			if (res.banner) {
				setBanner(res.banner);
			}
			if (res.nip05) {
				setNIP05((prev) => ({ ...prev, text: res.nip05 }));
			}
			return res;
		},
	});

	const onSubmit = async (data: NDKUserProfile) => {
		// start loading
		setLoading(true);

		let content = {
			...data,
			username: data.name,
			display_name: data.displayName,
			bio: data.about,
			image: picture,
			cover: banner,
			picture,
			banner,
		};

		if (data.nip05) {
			const verify = ark.validateNIP05({
				pubkey: ark.account.pubkey,
				nip05: data.nip05,
			});

			if (verify) {
				content = { ...content, nip05: data.nip05 };
			} else {
				setNIP05((prev) => ({ ...prev, verified: false }));
				setError("nip05", {
					type: "manual",
					message: "Can't verify your NIP-05, please check again",
				});
			}
		}

		const publish = await ark.createEvent({
			kind: NDKKind.Metadata,
			tags: [],
			content: JSON.stringify(content),
		});

		if (publish) {
			// invalid cache
			await storage.clearProfileCache(ark.account.pubkey);
			await queryClient.setQueryData(["user", ark.account.pubkey], () => {
				return content;
			});

			// notify
			toast.success("You've updated profile successfully.");

			// reset state
			setPicture(null);
			setBanner(null);
		}

		setLoading(false);
	};

	return (
		<div className="mx-auto w-full max-w-lg">
			<form onSubmit={handleSubmit(onSubmit)} className="mb-0">
				<div className="mb-5 flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-900 rounded-xl">
					<div className="relative h-44 w-full">
						{banner ? (
							<img
								src={banner}
								alt="user's banner"
								className="h-full w-full rounded-t-xl object-cover"
							/>
						) : (
							<div className="h-full w-full rounded-t-xl bg-neutral-200 dark:bg-neutral-800" />
						)}
						<div className="absolute right-4 top-4">
							<CoverUpload setBanner={setBanner} />
						</div>
					</div>
					<div className="-mt-7 mb-5 px-4 flex flex-col gap-4 items-center z-10 relative">
						<div className="size-14 overflow-hidden rounded-xl ring-2 ring-white dark:ring-black">
							<img
								src={picture}
								alt="user's avatar"
								className="h-14 w-14 rounded-xl object-cover bg-white dark:bg-black"
							/>
						</div>
						<AvatarUpload setPicture={setPicture} />
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<label
							htmlFor="displayName"
							className="text-sm font-semibold uppercase tracking-wider"
						>
							{t("user.displayName")}
						</label>
						<input
							type={"text"}
							{...register("displayName")}
							spellCheck={false}
							className="relative h-11 w-full rounded-lg border-transparent bg-neutral-100 px-3 py-1 text-neutral-900 !outline-none backdrop-blur-xl placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-900 dark:text-neutral-100"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label
							htmlFor="name"
							className="text-sm font-semibold uppercase tracking-wider"
						>
							{t("user.name")}
						</label>
						<input
							type={"text"}
							{...register("name")}
							spellCheck={false}
							className="relative h-11 w-full rounded-lg border-transparent bg-neutral-100 px-3 py-1 text-neutral-900 !outline-none backdrop-blur-xl placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-900 dark:text-neutral-100"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label
							htmlFor="nip05"
							className="text-sm font-semibold uppercase tracking-wider"
						>
							NIP-05
						</label>
						<div className="relative">
							<input
								{...register("nip05")}
								spellCheck={false}
								className="relative h-11 w-full rounded-lg border-transparent bg-neutral-100 px-3 py-1 text-neutral-900 !outline-none backdrop-blur-xl placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-900 dark:text-neutral-100"
							/>
							<div className="absolute right-2 top-1/2 -translate-y-1/2 transform">
								{nip05.verified ? (
									<span className="inline-flex h-6 items-center gap-1 rounded-full bg-teal-500 px-1 pr-1.5 text-xs font-medium text-white">
										<CheckCircleIcon className="h-4 w-4" />
										{t("user.verified")}
									</span>
								) : (
									<span className="inline-flex h-6 items-center gap-1 rounded bg-red-500 pl-1 pr-1.5 text-xs font-medium text-white">
										<UnverifiedIcon className="h-4 w-4" />
										{t("user.unverified")}
									</span>
								)}
							</div>
							{errors.nip05 && (
								<p className="mt-1 text-sm text-red-400">
									{errors.nip05.message.toString()}
								</p>
							)}
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<label
							htmlFor="website"
							className="text-sm font-semibold uppercase tracking-wider"
						>
							{t("user.website")}
						</label>
						<input
							type={"text"}
							{...register("website", { required: false })}
							spellCheck={false}
							className="relative h-11 w-full rounded-lg border-transparent bg-neutral-100 px-3 py-1 text-neutral-900 !outline-none backdrop-blur-xl placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-900 dark:text-neutral-100"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label
							htmlFor="website"
							className="text-sm font-semibold uppercase tracking-wider"
						>
							{t("user.lna")}
						</label>
						<input
							type={"text"}
							{...register("lud16", { required: false })}
							spellCheck={false}
							className="relative h-11 w-full rounded-lg border-transparent bg-neutral-100 px-3 py-1 text-neutral-900 !outline-none backdrop-blur-xl placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-900 dark:text-neutral-100"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label
							htmlFor="about"
							className="text-sm font-semibold uppercase tracking-wider"
						>
							{t("user.bio")}
						</label>
						<textarea
							{...register("about")}
							spellCheck={false}
							className="relative h-36 w-full resize-none rounded-lg border-transparent bg-neutral-100 px-3 py-2 text-neutral-900 !outline-none backdrop-blur-xl placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-900 dark:text-neutral-100"
						/>
					</div>
					<div className="absolute right-4 bottom-4">
						<button
							type="submit"
							disabled={!isValid || loading}
							className="inline-flex items-center justify-center w-24 pb-[2px] font-semibold border-t rounded-lg border-neutral-900 dark:border-neutral-800 h-9 bg-neutral-950 text-neutral-50 dark:bg-neutral-900 hover:bg-neutral-900 dark:hover:bg-neutral-800"
						>
							{loading ? (
								<LoaderIcon className="size-4 animate-spin" />
							) : (
								t("global.update")
							)}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
