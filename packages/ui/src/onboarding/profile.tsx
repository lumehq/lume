import { useArk } from "@lume/ark";
import { ArrowLeftIcon, LoaderIcon } from "@lume/icons";
import { useStorage } from "@lume/storage";
import { NDKKind, NDKUserProfile } from "@nostr-dev-kit/ndk";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { minidenticon } from "minidenticons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AvatarUploadButton } from "../avatarUploadButton";

export function OnboardingProfileScreen() {
	const [picture, setPicture] = useState("");
	const [loading, setLoading] = useState(false);

	const ark = useArk();
	const storage = useStorage();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { register, handleSubmit } = useForm();

	const svgURI = `data:image/svg+xml;utf8,${encodeURIComponent(
		minidenticon(ark.account.pubkey, 90, 50),
	)}`;

	const onSubmit = async (data: { name: string; about: string }) => {
		try {
			setLoading(true);

			if (!data.name.length && !data.about.length) {
				setLoading(false);
				navigate("/interests");
			}

			const prevProfile = await ark.getUserProfile();
			const newProfile: NDKUserProfile = {
				...data,
				nip05: prevProfile?.nip05 || "",
				bio: data.about,
				image: picture,
				picture: picture,
			};

			const publish = await ark.createEvent({
				content: JSON.stringify(newProfile),
				kind: NDKKind.Metadata,
				tags: [],
			});

			if (publish) {
				// invalid cache
				await storage.clearProfileCache(ark.account.pubkey);
				await queryClient.setQueryData(
					["user", ark.account.pubkey],
					() => newProfile,
				);

				setLoading(false);
				navigate("/interests");
			}
		} catch (e) {
			setLoading(false);
			toast.error(String(e));
		}
	};

	return (
		<div className="w-full h-full flex flex-col gap-4">
			<div className="h-16 shrink-0 px-8 border-b border-neutral-100 dark:border-neutral-900 flex w-full items-center justify-between">
				<div className="flex flex-col">
					<h3 className="font-semibold">About you</h3>
					<p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
						Tell Lume about yourself to start building your home feed.
					</p>
				</div>
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full flex-1 mb-0 flex flex-col justify-between"
			>
				<input type={"hidden"} {...register("picture")} value={picture} />
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					className="flex flex-col px-8 gap-4"
				>
					<div className="flex flex-col gap-1">
						<span className="font-medium">Avatar</span>
						<div className="flex h-36 w-full flex-col items-center justify-center gap-3 rounded-lg bg-neutral-100 dark:bg-neutral-950">
							{picture.length ? (
								<img
									src={picture}
									alt="user's avatar"
									className="size-16 rounded-xl object-cover"
								/>
							) : (
								<img
									src={svgURI}
									alt="user's avatar"
									className="size-16 rounded-xl bg-black dark:bg-white"
								/>
							)}
							<AvatarUploadButton setPicture={setPicture} />
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<label htmlFor="name" className="font-medium">
							Name *
						</label>
						<input
							type={"text"}
							{...register("name", { required: true, minLength: 1 })}
							placeholder="e.g. Alice"
							spellCheck={false}
							className="h-11 rounded-lg border-transparent bg-neutral-100 px-3 placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label htmlFor="about" className="font-medium">
							Bio
						</label>
						<textarea
							{...register("about")}
							placeholder="e.g. Artist, anime-lover, and k-pop fan"
							spellCheck={false}
							className="relative h-24 w-full resize-none rounded-lg border-transparent bg-neutral-100 px-3 py-2 !outline-none placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label htmlFor="website" className="font-medium">
							Website
						</label>
						<input
							type="url"
							{...register("website")}
							placeholder="e.g. https://alice.me"
							spellCheck={false}
							className="h-11 rounded-lg border-transparent bg-neutral-100 px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
					</div>
				</motion.div>
				<div className="h-16 w-full flex items-center px-8 justify-center gap-2 border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-950">
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="inline-flex h-9 flex-1 gap-2 shrink-0 items-center justify-center rounded-lg bg-neutral-100 font-medium dark:bg-neutral-900 dark:hover:bg-neutral-800 hover:bg-blue-200"
					>
						<ArrowLeftIcon className="size-4" />
						Back
					</button>
					<button
						type="submit"
						className="inline-flex h-9 flex-1 shrink-0 items-center justify-center rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
					>
						{loading ? (
							<LoaderIcon className="h-4 w-4 animate-spin" />
						) : (
							"Continue"
						)}
					</button>
				</div>
			</form>
		</div>
	);
}
