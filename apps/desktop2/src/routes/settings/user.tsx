import { AvatarUploader } from "@/components/avatarUploader";
import { PlusIcon } from "@lume/icons";
import type { Metadata } from "@lume/types";
import { Spinner } from "@lume/ui";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/settings/user")({
	beforeLoad: async ({ context }) => {
		const ark = context.ark;
		const profile = await ark.get_current_user_profile();
		return { profile };
	},
	component: Screen,
});

function Screen() {
	const { ark, profile } = Route.useRouteContext();
	const { register, handleSubmit } = useForm({ defaultValues: profile });

	const [loading, setLoading] = useState(false);
	const [picture, setPicture] = useState<string>("");

	const onSubmit = async (data: Metadata) => {
		try {
			setLoading(true);

			const newProfile: Metadata = { ...profile, ...data, picture };
			await ark.create_profile(newProfile);

			setLoading(false);
		} catch (e) {
			setLoading(false);
			toast.error(String(e));
		}
	};

	return (
		<div className="flex w-full h-full">
			<div className="flex-1 h-full flex items-center flex-col justify-center gap-3">
				<div className="relative size-24 rounded-full bg-gradient-to-tr from-orange-100 via-red-50 to-blue-200">
					{profile.picture ? (
						<img
							src={picture || profile.picture}
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
				<div className="text-center flex flex-col items-center">
					<div className="text-lg font-semibold">{profile.display_name}</div>
					<div className="text-neutral-800 dark:text-neutral-200">
						{profile.nip05}
					</div>
					<div className="mt-4">
						<Link
							to="/settings/backup"
							className="px-5 h-9 border border-blue-300 text-sm font-medium hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 rounded-full bg-blue-100 text-blue-500 inline-flex items-center justify-center"
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
					<div className="flex w-full flex-col gap-1">
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
							className="h-9 w-full rounded-lg border-neutral-300 bg-transparent px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
					</div>
					<div className="flex w-full flex-col gap-1">
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
							className="h-9 w-full rounded-lg border-neutral-300 bg-transparent px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
					</div>
					<div className="flex w-full flex-col gap-1">
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
							className="h-9 w-full rounded-lg border-neutral-300 bg-transparent px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
					</div>
					<div className="flex w-full flex-col gap-1">
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
							className="h-9 w-full rounded-lg border-neutral-300 bg-transparent px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
					</div>
					<div className="flex w-full flex-col gap-1">
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
							className="h-9 w-full rounded-lg border-neutral-300 bg-transparent px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
					</div>
					<div className="flex w-full flex-col gap-1">
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
							className="h-9 w-full rounded-lg border-neutral-300 bg-transparent px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
					</div>
					<div className="flex items-center justify-end">
						<button
							type="submit"
							className="inline-flex h-9 w-32 px-2 items-center justify-center rounded-lg bg-blue-500 font-medium text-sm text-white hover:bg-blue-600 disabled:opacity-50"
						>
							{loading ? <Spinner className="size-4" /> : "Update Profile"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
