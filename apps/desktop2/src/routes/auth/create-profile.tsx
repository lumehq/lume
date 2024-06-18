import { AvatarUploader } from "@/components/avatarUploader";
import { PlusIcon } from "@lume/icons";
import { NostrAccount } from "@lume/system";
import type { Metadata } from "@lume/types";
import { Spinner } from "@lume/ui";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/create-profile")({
	component: Screen,
	loader: async () => {
		const account = await NostrAccount.createAccount();
		return account;
	},
});

function Screen() {
	const account = Route.useLoaderData();
	const navigate = useNavigate();

	const { t } = useTranslation();
	const { register, handleSubmit } = useForm();

	const [picture, setPicture] = useState<string>("");
	const [loading, setLoading] = useState(false);

	const onSubmit = async (data: {
		name: string;
		about: string;
		website: string;
	}) => {
		setLoading(true);

		try {
			// Save account keys
			const save = await NostrAccount.saveAccount(account.nsec);

			// Then create profile
			if (save) {
				const profile: Metadata = { ...data, picture };
				const eventId = await NostrAccount.createProfile(profile);

				if (eventId) {
					navigate({
						to: "/auth/$account/backup",
						params: { account: account.npub },
						replace: true,
					});
				}
			}
		} catch (e) {
			setLoading(false);
			toast.error(String(e));
		}
	};

	return (
		<div className="flex flex-col items-center justify-center w-full h-full gap-6 px-5 mx-auto xl:max-w-xl">
			<div className="text-center">
				<h3 className="text-xl font-semibold">Let's set up your profile.</h3>
			</div>
			<div>
				<div className="relative rounded-full size-24 bg-gradient-to-tr from-orange-100 via-red-50 to-blue-200">
					{picture ? (
						<img
							src={picture}
							alt="avatar"
							loading="lazy"
							decoding="async"
							className="absolute inset-0 z-10 object-cover w-full h-full rounded-full"
						/>
					) : null}
					<AvatarUploader
						setPicture={setPicture}
						className="absolute inset-0 z-20 flex items-center justify-center w-full h-full text-white rounded-full dark:text-black bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
					>
						<PlusIcon className="size-8" />
					</AvatarUploader>
				</div>
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col w-full gap-3"
			>
				<div className="flex flex-col gap-1">
					<label htmlFor="display_name" className="font-medium">
						{t("user.displayName")} *
					</label>
					<input
						type={"text"}
						{...register("display_name", { required: true, minLength: 1 })}
						placeholder="e.g. Alice in Nostrland"
						spellCheck={false}
						className="px-3 border-transparent rounded-lg h-11 bg-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:ring-0 dark:bg-white/10 dark:placeholder:text-neutral-400"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label htmlFor="name" className="font-medium">
						{t("user.name")}
					</label>
					<input
						type={"text"}
						{...register("name")}
						placeholder="e.g. alice"
						spellCheck={false}
						className="px-3 border-transparent rounded-lg h-11 bg-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:ring-0 dark:bg-white/10 dark:placeholder:text-neutral-400"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label htmlFor="about" className="font-medium">
						{t("user.bio")}
					</label>
					<textarea
						{...register("about")}
						placeholder="e.g. Artist, anime-lover, and k-pop fan"
						spellCheck={false}
						className="relative h-24 w-full resize-none rounded-lg border-transparent bg-neutral-100 px-3 py-2 !outline-none placeholder:text-neutral-600 focus:border-blue-500 focus:ring-0 dark:bg-white/10 dark:placeholder:text-neutral-400"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label htmlFor="website" className="font-medium">
						{t("user.website")}
					</label>
					<input
						type="url"
						{...register("website")}
						placeholder="e.g. https://alice.me"
						spellCheck={false}
						className="px-3 border-transparent rounded-lg h-11 bg-neutral-100 placeholder:text-neutral-500 focus:border-blue-500 focus:ring-0 dark:bg-white/10 dark:placeholder:text-neutral-400"
					/>
				</div>
				<button
					type="submit"
					className="inline-flex items-center justify-center w-full mt-3 font-semibold text-white bg-blue-500 rounded-lg h-11 shrink-0 hover:bg-blue-600 disabled:opacity-50"
				>
					{loading ? <Spinner /> : t("global.continue")}
				</button>
			</form>
		</div>
	);
}
