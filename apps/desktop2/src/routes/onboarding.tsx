import { ArrowRightIcon, CancelIcon } from "@lume/icons";
import type { ColumnRouteSearch, LumeColumn } from "@lume/types";
import { Spinner, User } from "@lume/ui";
import { cn } from "@lume/utils";
import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { getCurrent } from "@tauri-apps/api/window";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
	validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
		return {
			account: search.account,
			label: search.label,
			name: search.name,
		};
	},
	component: Screen,
});

function Screen() {
	const { label } = Route.useSearch();
	const {
		register,
		handleSubmit,
		reset,
		formState: { isValid, isSubmitting },
	} = useForm();

	const [userType, setUserType] = useState<"new" | "veteran">(null);

	const install = async (column: LumeColumn) => {
		const mainWindow = getCurrent();
		await mainWindow.emit("columns", { type: "add", column });
	};

	const close = async () => {
		const mainWindow = getCurrent();
		await mainWindow.emit("columns", { type: "remove", label });
	};

	const friendToFriend = async (data: { npub: string }) => {
		if (!data.npub.startsWith("npub1"))
			return toast.warning(
				"NPUB is invalid. NPUB must be starts with npub1...",
			);

		try {
			const connect: boolean = await invoke("friend_to_friend", {
				npub: data.npub,
			});

			if (connect) {
				const column = {
					label: "newsfeed",
					name: "Newsfeed",
					content: "/newsfeed",
				};
				const mainWindow = getCurrent();
				await mainWindow.emit("columns", { type: "add", column });

				// reset form
				reset();
			}
		} catch (e) {
			toast.error(String(e));
		}
	};

	return (
		<div className="h-full flex flex-col py-6 gap-6 overflow-y-auto scrollbar-none">
			<div className="text-center flex flex-col items-center justify-center">
				<h1 className="text-2xl font-serif font-medium">Welcome to Lume</h1>
				<p className="leading-tight text-neutral-700 dark:text-neutral-300">
					Here are a few suggestions to help you get started.
				</p>
			</div>
			<div className="px-3">
				<div className="mb-6 w-full h-44">
					<img
						src="/lock-screen.jpg"
						srcSet="/lock-screen@2x.jpg 2x"
						alt="background"
						className="h-full w-full object-cover rounded-xl outline outline-1 -outline-offset-1 outline-black/15"
					/>
				</div>
				<div className="flex flex-col gap-6">
					<div className="flex items-start gap-2 text-[13px]">
						<Mide />
						<div className="flex flex-col gap-0.5">
							<h3 className="font-semibold">Mide</h3>
							<div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg">
								👋 Yo! I'm Mide, and I'll be your friendly guide to Nostr and
								beyond. Looking forward to our adventure together!
							</div>
						</div>
					</div>
					<div className="flex items-start flex-row-reverse gap-2 text-[13px]">
						<CurrentUser />
						<div className="flex flex-col gap-0.5">
							<h3 className="font-semibold text-end">You</h3>
							<div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg">
								How can I get started?
							</div>
							<button
								type="button"
								onClick={() => setUserType("new")}
								className={cn(
									"mt-1 px-3 py-2 shadow-primary flex items-center justify-between gap-6 bg-white hover:bg-blue-500 hover:text-white dark:bg-white/10 rounded-lg",
									userType === "new"
										? "bg-blue-500 text-white hover:bg-blue-600"
										: "",
								)}
							>
								I'm completely new to Nostr.
								<ArrowRightIcon className="size-4" />
							</button>
							<button
								type="button"
								onClick={() => setUserType("veteran")}
								className={cn(
									"mt-1 px-3 py-2 shadow-primary flex items-center justify-between gap-6 bg-white hover:bg-blue-500 hover:text-white dark:bg-white/10 rounded-lg",
									userType === "veteran"
										? "bg-blue-500 text-white hover:bg-blue-600"
										: "",
								)}
							>
								I've already been using another Nostr client.
								<ArrowRightIcon className="size-4" />
							</button>
						</div>
					</div>
					{userType === "veteran" ? (
						<div className="flex items-start gap-2 text-[13px]">
							<Mide />
							<div className="flex flex-col gap-0.5">
								<h3 className="font-semibold">Mide</h3>
								<div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg">
									So, I'm excited to give you a quick intro to Lume and all the
									awesome features it has to offer. Let's dive in!
								</div>
							</div>
						</div>
					) : null}
					{userType === "veteran" ? (
						<div className="flex items-start flex-row-reverse gap-2 text-[13px]">
							<CurrentUser />
							<div className="flex flex-col gap-0.5">
								<h3 className="font-semibold text-end">You</h3>
								<div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg">
									Thanks! But I already know about Lume.
								</div>
								<button
									type="button"
									onClick={() =>
										install({
											label: "newsfeed",
											name: "Newsfeed",
											content: "/newsfeed",
										})
									}
									className="mt-1 px-3 py-2 shadow-primary flex items-center justify-between gap-6 bg-white hover:bg-blue-500 hover:text-white dark:bg-white/10 rounded-lg"
								>
									Skip! Show my newsfeed
									<ArrowRightIcon className="size-4" />
								</button>
							</div>
						</div>
					) : null}
					{userType === "veteran" ? (
						<div className="flex items-start gap-2 text-[13px]">
							<Mide />
							<div className="flex flex-col gap-0.5">
								<h3 className="font-semibold">Mide</h3>
								<div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg">
									First off, Lume is a social media client for Nostr. It's a
									place where you can follow friends, dive into chats, and post
									what's on your mind.
								</div>
							</div>
						</div>
					) : null}
					{userType === "veteran" ? (
						<div className="flex items-start gap-2 text-[13px]">
							<Mide />
							<div className="flex flex-col gap-0.5">
								<h3 className="font-semibold">Mide</h3>
								<div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg">
									That's not all! What makes Lume unique is the column system.
									You can enhance your experience by adding new columns from the
									Lume Store.
								</div>
								<div className="mt-1 p-2 bg-black/5 dark:bg-white/5 rounded-lg">
									If you're confused about the term "Column," you can imagine it
									as mini-apps, with each column providing its own experience.
								</div>
								<div className="mt-1 p-2 bg-black/5 dark:bg-white/5 rounded-lg">
									Here is a quick guide for how to add a new column:
								</div>
								<div className="mt-1 rounded-lg">
									<video
										className="h-auto w-full rounded-lg object-cover aspect-video outline outline-1 -outline-offset-1 outline-black/15"
										controls
										muted
									>
										<source
											src="https://samplelib.com/lib/preview/mp4/sample-5s.mp4"
											type="video/mp4"
										/>
										Your browser does not support the video tag.
									</video>
								</div>
							</div>
						</div>
					) : null}
					{userType === "veteran" ? (
						<div className="flex items-start flex-row-reverse gap-2 text-[13px]">
							<CurrentUser />
							<div className="flex flex-col gap-0.5">
								<h3 className="font-semibold text-end">You</h3>
								<div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg">
									Can you introduce me to the UI? I am still confused.
								</div>
							</div>
						</div>
					) : null}
					{userType === "veteran" ? (
						<div className="flex items-start gap-2 text-[13px]">
							<Mide />
							<div className="flex flex-col gap-0.5">
								<h3 className="font-semibold">Mide</h3>
								<div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg">
									Of course, here is a quick introduction video for Lume.
								</div>
								<div className="mt-1 rounded-lg">
									<video
										className="h-auto w-full rounded-lg object-cover aspect-video outline outline-1 -outline-offset-1 outline-black/15"
										controls
										muted
									>
										<source
											src="https://samplelib.com/lib/preview/mp4/sample-5s.mp4"
											type="video/mp4"
										/>
										Your browser does not support the video tag.
									</video>
								</div>
							</div>
						</div>
					) : null}
					{userType === "new" ? (
						<div className="flex items-start gap-2 text-[13px]">
							<Mide />
							<div className="flex flex-col gap-0.5">
								<h3 className="font-semibold">Mide</h3>
								<div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg">
									Diving into new social media platforms like Nostr can be a bit
									overwhelming, but don't worry! Here are some handy tips to
									help you navigate and discover what interests you.
								</div>
								<button
									type="button"
									onClick={() =>
										install({
											label: "foryou",
											name: "For you",
											content: "/foryou",
										})
									}
									className="mt-1 px-3 py-2 shadow-primary flex items-center justify-between bg-white hover:bg-blue-500 hover:text-white dark:bg-white/10 rounded-lg"
								>
									Add some topics that you're interested in.
									<ArrowRightIcon className="size-4" />
								</button>
								<button
									type="button"
									onClick={() =>
										install({
											label: "trending_users",
											name: "Trending",
											content: "/trending/users",
										})
									}
									className="mt-1 px-3 py-2 shadow-primary flex items-center justify-between bg-white hover:bg-blue-500 hover:text-white dark:bg-white/10 rounded-lg"
								>
									Follow some users.
									<ArrowRightIcon className="size-4" />
								</button>
							</div>
						</div>
					) : null}
					{userType === "new" ? (
						<div className="flex items-start flex-row-reverse gap-2 text-[13px]">
							<CurrentUser />
							<div className="flex flex-col gap-0.5">
								<h3 className="font-semibold text-end">You</h3>
								<div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg">
									My girlfriend introduced Nostr to me, and I have her NPUB. Can
									I get the same experiences as her?
								</div>
							</div>
						</div>
					) : null}
					{userType === "new" ? (
						<div className="flex items-start gap-2 text-[13px]">
							<Mide />
							<div className="flex flex-col gap-0.5">
								<h3 className="font-semibold">Mide</h3>
								<div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg">
									Absolutely! Since your girlfriend shared her NPUB with you,
									you can dive into Nostr and explore it just like she does.
									It's a great way to share experiences and discover what Nostr
									has to offer together!
								</div>
								<form
									onSubmit={handleSubmit(friendToFriend)}
									className="mt-1 flex flex-col items-end bg-white dark:bg-white/10 rounded-lg shadow-primary"
								>
									<input
										{...register("npub", { required: true })}
										name="npub"
										placeholder="Enter npub here..."
										className="w-full h-14 px-3 rounded-t-lg bg-transparent border-b border-x-0 border-t-0 border-neutral-100 dark:border-white/5 focus:border-neutral-200 dark:focus:border-white/20 focus:outline-none focus:ring-0 placeholder:text-neutral-600 dark:placeholder:text-neutral-400"
									/>
									<div className="h-10 flex items-center px-1">
										<button
											type="submit"
											disabled={!isValid || isSubmitting}
											className="px-2 h-8 w-20 inline-flex items-center justify-center bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
										>
											{isSubmitting ? <Spinner className="size-4" /> : "Submit"}
										</button>
									</div>
								</form>
							</div>
						</div>
					) : null}
					{userType ? (
						<>
							<div className="flex items-start flex-row-reverse gap-2 text-[13px]">
								<CurrentUser />
								<div className="flex flex-col gap-0.5">
									<h3 className="font-semibold text-end">You</h3>
									<div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg">
										Thank you. I can use Lume and explore Nostr by myself from
										now on.
									</div>
								</div>
							</div>
							<div className="flex items-start gap-2 text-[13px]">
								<Mide />
								<div className="flex flex-col gap-0.5">
									<h3 className="font-semibold">Mide</h3>
									<div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg">
										I really hope you enjoy your time on Nostr! If you're keen
										to dive deeper, here are some helpful resources to get you
										started:
									</div>
									<a
										href="https://nostr.org"
										target="_blank"
										className="mt-1 px-3 py-2 shadow-primary flex items-center justify-between bg-white hover:bg-blue-500 hover:text-white dark:bg-white/10 rounded-lg"
										rel="noreferrer"
									>
										[Website] nostr.org
										<ArrowRightIcon className="size-4" />
									</a>
									<a
										href="https://www.youtube.com/watch?v=5W-jtbbh3eA"
										target="_blank"
										className="mt-1 px-3 py-2 shadow-primary flex items-center justify-between bg-white hover:bg-blue-500 hover:text-white dark:bg-white/10 rounded-lg"
										rel="noreferrer"
									>
										[Video] What is Nostr?
										<ArrowRightIcon className="size-4" />
									</a>
									<a
										href="https://github.com/nostr-protocol/nostr"
										target="_blank"
										className="mt-1 px-3 py-2 shadow-primary flex items-center justify-between bg-white hover:bg-blue-500 hover:text-white dark:bg-white/10 rounded-lg"
										rel="noreferrer"
									>
										[Develop] Github
										<ArrowRightIcon className="size-4" />
									</a>
									<a
										href="https://www.nostrapps.com/"
										target="_blank"
										className="mt-1 px-3 py-2 shadow-primary flex items-center justify-between bg-white hover:bg-blue-500 hover:text-white dark:bg-white/10 rounded-lg"
										rel="noreferrer"
									>
										[Ecosystem] nostrapps.com
										<ArrowRightIcon className="size-4" />
									</a>
								</div>
							</div>
							<div className="flex items-start gap-2 text-[13px]">
								<Mide />
								<div className="flex flex-col gap-0.5">
									<h3 className="font-semibold">Mide</h3>
									<div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg">
										If you want to close this onboarding board, you can click
										the button below.
									</div>
									<button
										type="button"
										onClick={() => close()}
										className="mt-1 px-3 py-2 shadow-primary flex items-center justify-between bg-white hover:bg-blue-500 hover:text-white dark:bg-white/10 rounded-lg"
									>
										Close
										<CancelIcon className="size-4" />
									</button>
								</div>
							</div>
						</>
					) : null}
				</div>
			</div>
		</div>
	);
}

function Mide() {
	return (
		<img
			src="/ai.jpg"
			alt="Ai-chan"
			className="shrink-0 size-10 rounded-full outline outline-1 -outline-offset-1 outline-black/15"
		/>
	);
}

function CurrentUser() {
	const { account } = Route.useSearch();

	return (
		<User.Provider pubkey={account}>
			<User.Root className="shrink-0">
				<User.Avatar className="size-10 rounded-full outline outline-1 -outline-offset-1 outline-black/15" />
			</User.Root>
		</User.Provider>
	);
}
