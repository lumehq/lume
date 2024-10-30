import { commands } from "@/commands.gen";
import { cn, upload } from "@/commons";
import { Spinner } from "@/components";
import type { Metadata } from "@/types";
import { Plus } from "@phosphor-icons/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { createLazyFileRoute } from "@tanstack/react-router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { message } from "@tauri-apps/plugin-dialog";
import {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useState,
	useTransition,
} from "react";
import { useForm } from "react-hook-form";

export const Route = createLazyFileRoute("/$id/set-profile")({
	component: Screen,
});

function Screen() {
	const { id } = Route.useParams();
	const { profile, queryClient } = Route.useRouteContext();
	const { register, handleSubmit } = useForm({ defaultValues: profile });

	const [picture, setPicture] = useState<string>("");
	const [isPending, startTransition] = useTransition();

	const onSubmit = (data: Metadata) => {
		startTransition(async () => {
			const signer = await commands.hasSigner(id);

			if (signer.status === "ok") {
				if (!signer.data) {
					const res = await commands.setSigner(id);

					if (res.status === "error") {
						await message(res.error, { kind: "error" });
						return;
					}
				}
			} else {
				await message(signer.error, { kind: "error" });
				return;
			}

			const newProfile: Metadata = { ...profile, ...data, picture };
			const res = await commands.setProfile(JSON.stringify(newProfile));

			if (res.status === "ok") {
				// Invalidate cache
				await queryClient.invalidateQueries({
					queryKey: ["profile", id],
				});

				// Close current popup
				await getCurrentWindow().close();
			} else {
				await message(res.error, { title: "Profile", kind: "error" });
				return;
			}
		});
	};

	return (
		<div className="flex flex-col size-full">
			<div data-tauri-drag-region className="shrink-0 h-11" />
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="min-h-0 flex-1 flex flex-col mb-0"
			>
				<div className="shrink-0 h-20 flex items-center gap-3 p-3 border-b border-black/5 dark:border-white/5">
					<div className="relative rounded-full size-12 bg-gradient-to-tr from-orange-100 via-red-50 to-blue-200">
						{profile.picture ? (
							<img
								src={picture || profile.picture}
								alt="avatar"
								loading="lazy"
								decoding="async"
								className="absolute inset-0 z-10 object-cover size-12 rounded-full"
							/>
						) : null}
						<AvatarUploader
							setPicture={setPicture}
							className="absolute inset-0 z-20 flex items-center justify-center size-full text-white rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
						>
							<Plus className="size-5" />
						</AvatarUploader>
					</div>
					<div className="flex-1 flex justify-between items-center">
						<div>
							<div className="font-semibold">{profile.display_name}</div>
							<div className="leading-tight text-sm text-neutral-700 dark:text-neutral-300">
								{profile.nip05?.startsWith("_")
									? profile.nip05.replace("_@", "")
									: profile.nip05}
							</div>
						</div>
						<button
							type="submit"
							disabled={isPending}
							className="inline-flex items-center justify-center w-28 h-8 px-2 text-xs font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50"
						>
							{isPending ? <Spinner className="size-4" /> : "Update Profile"}
						</button>
					</div>
				</div>
				<ScrollArea.Root
					type={"scroll"}
					scrollHideDelay={300}
					className="min-h-0 flex-1 overflow-hidden"
				>
					<ScrollArea.Viewport className="bg-white dark:bg-black h-full p-3">
						<div className="flex flex-col gap-4">
							<div className="flex flex-col w-full gap-1.5">
								<label htmlFor="display_name" className="text-sm font-medium">
									Display Name
								</label>
								<input
									{...register("display_name")}
									spellCheck={false}
									className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
								/>
							</div>
							<div className="flex flex-col w-full gap-1.5">
								<label htmlFor="name" className="text-sm font-medium">
									Name
								</label>
								<input
									{...register("name")}
									spellCheck={false}
									className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
								/>
							</div>
							<div className="flex flex-col w-full gap-1.5">
								<label htmlFor="website" className="text-sm font-medium">
									Website
								</label>
								<input
									type="url"
									{...register("website")}
									spellCheck={false}
									className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
								/>
							</div>
							<div className="flex flex-col w-full gap-1.5">
								<label htmlFor="banner" className="text-sm font-medium">
									Cover
								</label>
								<input
									type="url"
									{...register("banner")}
									spellCheck={false}
									className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
								/>
							</div>
							<div className="flex flex-col w-full gap-1.5">
								<label htmlFor="nip05" className="text-sm font-medium">
									NIP-05
								</label>
								<input
									type="email"
									{...register("nip05")}
									spellCheck={false}
									className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
								/>
							</div>
							<div className="flex flex-col w-full gap-1.5">
								<label htmlFor="lnaddress" className="text-sm font-medium">
									Lightning Address
								</label>
								<input
									type="email"
									{...register("lud16")}
									className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
								/>
							</div>
						</div>
					</ScrollArea.Viewport>
					<ScrollArea.Scrollbar
						className="flex select-none touch-none p-0.5 duration-[160ms] ease-out data-[orientation=vertical]:w-2"
						orientation="vertical"
					>
						<ScrollArea.Thumb className="flex-1 bg-black/10 dark:bg-white/10 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
					</ScrollArea.Scrollbar>
					<ScrollArea.Corner className="bg-transparent" />
				</ScrollArea.Root>
			</form>
		</div>
	);
}

function AvatarUploader({
	setPicture,
	children,
	className,
}: {
	setPicture: Dispatch<SetStateAction<string>>;
	children: ReactNode;
	className?: string;
}) {
	const [isPending, startTransition] = useTransition();

	const uploadAvatar = () => {
		startTransition(async () => {
			try {
				const image = await upload();

				if (image) {
					setPicture(image);
				}
			} catch (e) {
				await message(String(e));
				return;
			}
		});
	};

	return (
		<button
			type="button"
			onClick={() => uploadAvatar()}
			className={cn("size-4", className)}
		>
			{isPending ? <Spinner className="size-4" /> : children}
		</button>
	);
}
