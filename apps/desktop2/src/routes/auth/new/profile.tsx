import { AvatarUploader } from "@/components/avatarUploader";
import { PlusIcon } from "@lume/icons";
import type { Metadata } from "@lume/types";
import { Spinner } from "@lume/ui";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/new/profile")({
	component: Screen,
	loader: ({ context }) => {
		return context.ark.create_keys();
	},
});

function Screen() {
	const keys = Route.useLoaderData();
	const navigate = useNavigate();

	const { t } = useTranslation();
	const { ark } = Route.useRouteContext();
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
			const save = await ark.save_account(keys.nsec);

			// Then create profile
			if (save) {
				const profile: Metadata = { ...data, picture };
				const eventId = await ark.create_profile(profile);

				if (eventId) {
					navigate({
						to: "/auth/new/backup",
						search: { account: keys.npub },
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
		<div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-6 px-5 xl:max-w-xl">
			<div className="text-center">
				<h3 className="text-xl font-semibold">Let's set up your profile.</h3>
			</div>
			<div>
				<div className="relative size-24 rounded-full bg-gradient-to-tr from-orange-100 via-red-50 to-blue-200">
					{picture ? (
						<img
							src={picture}
							alt="avatar"
							loading="lazy"
							decoding="async"
							className="absolute inset-0 z-10 h-full w-full rounded-full object-cover"
						/>
					) : null}
					<AvatarUploader
						setPicture={setPicture}
						className="absolute inset-0 z-20 flex h-full w-full items-center justify-center rounded-full bg-black/10 text-white hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
					>
						<PlusIcon className="size-8" />
					</AvatarUploader>
				</div>
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex w-full flex-col gap-3"
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
						className="h-11 rounded-lg border-transparent bg-neutral-100 px-3 placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
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
						className="h-11 rounded-lg border-transparent bg-neutral-100 px-3 placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
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
						className="relative h-24 w-full resize-none rounded-lg border-transparent bg-neutral-100 px-3 py-2 !outline-none placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
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
						className="h-11 rounded-lg border-transparent bg-neutral-100 px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
					/>
				</div>
				<button
					type="submit"
					className="mt-3 inline-flex h-11 w-full shrink-0  items-center justify-center rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
				>
					{loading ? <Spinner /> : t("global.continue")}
				</button>
			</form>
		</div>
	);
}
