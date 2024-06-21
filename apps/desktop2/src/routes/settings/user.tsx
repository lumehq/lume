import { AvatarUploader } from "@/components/avatarUploader";
import { PlusIcon } from "@lume/icons";
import { NostrAccount } from "@lume/system";
import type { Metadata } from "@lume/types";
import { Spinner } from "@lume/ui";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { message } from "@tauri-apps/plugin-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/settings/user")({
	beforeLoad: async () => {
		const profile = await NostrAccount.getProfile();
		return { profile };
	},
	component: Screen,
});

function Screen() {
	const { profile } = Route.useRouteContext();
	const { register, handleSubmit } = useForm({ defaultValues: profile });

	const [loading, setLoading] = useState(false);
	const [picture, setPicture] = useState<string>("");

	const onSubmit = async (data: Metadata) => {
		try {
			setLoading(true);

			const newProfile: Metadata = { ...profile, ...data, picture };
			await NostrAccount.createProfile(newProfile);

			setLoading(false);
		} catch (e) {
			setLoading(false);
			await message(String(e), { title: "Profile", kind: "error" });
		}
	};

	return (
		<div className="flex w-full h-full">
			<div className="flex flex-col items-center justify-center flex-1 h-full gap-3">
				<div className="relative rounded-full size-24 bg-gradient-to-tr from-orange-100 via-red-50 to-blue-200">
					{profile.picture ? (
						<img
							src={picture || profile.picture}
							alt="avatar"
							loading="lazy"
							decoding="async"
							className="absolute inset-0 z-10 object-cover w-full h-full rounded-full"
						/>
					) : null}
					<AvatarUploader
						setPicture={setPicture}
						className="absolute inset-0 z-20 flex items-center justify-center w-full h-full text-white rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
					>
						<PlusIcon className="size-8" />
					</AvatarUploader>
				</div>
				<div className="flex flex-col items-center text-center">
					<div className="text-lg font-semibold">{profile.display_name}</div>
					<div className="text-neutral-800 dark:text-neutral-200">
						{profile.nip05}
					</div>
					<div className="mt-4">
						<Link
							to="/settings/backup"
							className="inline-flex items-center justify-center px-5 text-sm font-medium text-blue-500 bg-blue-100 border border-blue-300 rounded-full h-9 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
						>
							Backup Account
						</Link>
					</div>
				</div>
			</div>
			<div className="flex-1 h-full">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-3 mb-0"
				>
					<div className="flex flex-col w-full gap-1">
						<label
							htmlFor="display_name"
							className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
						>
							Display Name
						</label>
						<input
							name="display_name"
							{...register("display_name")}
							spellCheck={false}
							className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
					</div>
					<div className="flex flex-col w-full gap-1">
						<label
							htmlFor="name"
							className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
						>
							Name
						</label>
						<input
							name="name"
							{...register("name")}
							spellCheck={false}
							className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
					</div>
					<div className="flex flex-col w-full gap-1">
						<label
							htmlFor="website"
							className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
						>
							Website
						</label>
						<input
							name="website"
							type="url"
							{...register("website")}
							spellCheck={false}
							className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
					</div>
					<div className="flex flex-col w-full gap-1">
						<label
							htmlFor="banner"
							className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
						>
							Cover
						</label>
						<input
							name="banner"
							type="url"
							{...register("banner")}
							spellCheck={false}
							className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
					</div>
					<div className="flex flex-col w-full gap-1">
						<label
							htmlFor="nip05"
							className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
						>
							NIP-05
						</label>
						<input
							name="nip05"
							type="email"
							{...register("nip05")}
							spellCheck={false}
							className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
					</div>
					<div className="flex flex-col w-full gap-1">
						<label
							htmlFor="lnaddress"
							className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
						>
							Lightning Address
						</label>
						<input
							name="lnaddress"
							type="email"
							{...register("lud16")}
							className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
					</div>
					<div className="flex items-center justify-end">
						<button
							type="submit"
							className="inline-flex items-center justify-center w-32 px-2 text-sm font-medium text-white bg-blue-500 rounded-lg h-9 hover:bg-blue-600 disabled:opacity-50"
						>
							{loading ? <Spinner className="size-4" /> : "Update Profile"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
