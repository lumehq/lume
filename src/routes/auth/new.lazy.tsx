import { commands } from "@/commands.gen";
import { Frame, GoBack, Spinner } from "@/components";
import { NostrQuery } from "@/system";
import { Plus } from "@phosphor-icons/react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { message } from "@tauri-apps/plugin-dialog";
import { useState, useTransition } from "react";

export const Route = createLazyFileRoute("/auth/new")({
	component: Screen,
});

function Screen() {
	const navigate = Route.useNavigate();

	const [password, setPassword] = useState("");
	const [picture, setPicture] = useState<string>("");
	const [name, setName] = useState("");
	const [about, setAbout] = useState("");
	const [isPending, startTransition] = useTransition();

	const uploadAvatar = async () => {
		const file = await NostrQuery.upload();

		if (file) {
			setPicture(file);
		} else {
			return;
		}
	};

	const submit = () => {
		startTransition(async () => {
			if (!name.length) {
				await message("Please add your name", {
					title: "New Identity",
					kind: "info",
				});
				return;
			}

			if (!password.length) {
				await message("You must set password to secure your account", {
					title: "New Identity",
					kind: "info",
				});
				return;
			}

			const res = await commands.createAccount(name, picture, about, password);

			if (res.status === "ok") {
				navigate({
					to: "/",
					replace: true,
				});
			} else {
				await message(res.error, {
					title: "New Identity",
					kind: "error",
				});
				return;
			}
		});
	};

	return (
		<div
			data-tauri-drag-region
			className="size-full flex items-center justify-center"
		>
			<div className="w-[320px] flex flex-col gap-8">
				<div className="flex flex-col gap-1 text-center">
					<h1 className="leading-tight text-xl font-semibold">New Identity</h1>
				</div>
				<div className="flex flex-col gap-3">
					<Frame
						className="flex flex-col gap-3 p-3 rounded-xl overflow-hidden"
						shadow
					>
						<div className="self-center relative rounded-full size-20 bg-neutral-100 dark:bg-white/10 my-3">
							{picture.length ? (
								<img
									src={picture}
									alt="avatar"
									loading="lazy"
									decoding="async"
									className="absolute inset-0 z-10 object-cover w-full h-full rounded-full"
								/>
							) : null}
							<button
								type="button"
								onClick={() => uploadAvatar()}
								className="absolute inset-0 z-20 flex items-center justify-center w-full h-full rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
							>
								<Plus className="size-5" />
							</button>
						</div>
						<div className="flex flex-col gap-1">
							<label
								htmlFor="name"
								className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
							>
								Name *
							</label>
							<input
								name="name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="e.g. Alice"
								spellCheck={false}
								className="px-3 rounded-lg h-10 bg-transparent border border-neutral-200 dark:border-neutral-500 focus:ring-0 focus:border-blue-500 focus:outline-none placeholder:text-neutral-400 dark:text-neutral-600"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label
								htmlFor="about"
								className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
							>
								About
							</label>
							<textarea
								name="about"
								value={about}
								onChange={(e) => setAbout(e.target.value)}
								placeholder="e.g. Artist, anime-lover, and k-pop fan"
								spellCheck={false}
								className="px-3 py-1.5 rounded-lg min-h-16 bg-transparent border border-neutral-200 dark:border-neutral-500 focus:ring-0 focus:border-blue-500 focus:outline-none placeholder:text-neutral-400 dark:text-neutral-600"
							/>
						</div>
						<div className="h-px w-full mt-2 bg-neutral-100 dark:bg-neutral-900" />
						<div className="flex flex-col gap-1">
							<label
								htmlFor="password"
								className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
							>
								Set password to secure your account *
							</label>
							<input
								name="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="px-3 rounded-lg h-10 bg-transparent border border-neutral-200 dark:border-neutral-500 focus:ring-0 focus:border-blue-500 focus:outline-none placeholder:text-neutral-400 dark:text-neutral-600"
							/>
						</div>
					</Frame>
					<div className="flex flex-col items-center gap-1">
						<button
							type="button"
							onClick={() => submit()}
							disabled={isPending}
							className="inline-flex items-center justify-center w-full h-9 text-sm font-semibold text-white bg-blue-500 rounded-lg shrink-0 hover:bg-blue-600 disabled:opacity-50"
						>
							{isPending ? <Spinner /> : "Continue"}
						</button>
						<GoBack className="mt-2 w-full text-sm text-neutral-600 dark:text-neutral-400 inline-flex items-center justify-center">
							Go back to previous screen
						</GoBack>
					</div>
				</div>
			</div>
		</div>
	);
}
