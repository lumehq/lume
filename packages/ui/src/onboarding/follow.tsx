import { useArk } from "@lume/ark";
import {
	ArrowLeftIcon,
	CancelIcon,
	ChevronDownIcon,
	LoaderIcon,
	PlusIcon,
} from "@lume/icons";
import { cn } from "@lume/utils";
import * as Accordion from "@radix-ui/react-accordion";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { nip19 } from "nostr-tools";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User } from "../user";

const POPULAR_USERS = [
	"npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkwsyjh6w6",
	"npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m",
	"npub1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrgufzsevkk5s",
	"npub1gcxzte5zlkncx26j68ez60fzkvtkm9e0vrwdcvsjakxf9mu9qewqlfnj5z",
	"npub1az9xj85cmxv8e9j9y80lvqp97crsqdu2fpu3srwthd99qfu9qsgstam8y8",
	"npub1a2cww4kn9wqte4ry70vyfwqyqvpswksna27rtxd8vty6c74era8sdcw83a",
	"npub168ghgug469n4r2tuyw05dmqhqv5jcwm7nxytn67afmz8qkc4a4zqsu2dlc",
	"npub133vj8ycevdle0cq8mtgddq0xtn34kxkwxvak983dx0u5vhqnycyqj6tcza",
	"npub18ams6ewn5aj2n3wt2qawzglx9mr4nzksxhvrdc4gzrecw7n5tvjqctp424",
	"npub1r0rs5q2gk0e3dk3nlc7gnu378ec6cnlenqp8a3cjhyzu6f8k5sgs4sq9ac",
	"npub1prya33fnqerq0fljwjtp77ehtu7jlsjt5ydhwveuwmqdsdm6k8esk42xcv",
	"npub19mduaf5569jx9xz555jcx3v06mvktvtpu0zgk47n4lcpjsz43zzqhj6vzk",
];

const LUME_USERS = [
	"npub1zfss807aer0j26mwp2la0ume0jqde3823rmu97ra6sgyyg956e0s6xw445",
];

export function OnboardingFollowScreen() {
	const ark = useArk();
	const navigate = useNavigate();

	const { isLoading, isError, data } = useQuery({
		queryKey: ["trending-users"],
		queryFn: async ({ signal }: { signal: AbortSignal }) => {
			const res = await fetch("https://api.nostr.band/v0/trending/profiles", {
				signal,
			});
			if (!res.ok) {
				throw new Error("Failed to fetch trending users from nostr.band API.");
			}
			return res.json();
		},
	});

	const [loading, setLoading] = useState(false);
	const [follows, setFollows] = useState<string[]>([]);

	// toggle follow state
	const toggleFollow = (pubkey: string) => {
		const arr = follows.includes(pubkey)
			? follows.filter((i) => i !== pubkey)
			: [...follows, pubkey];
		setFollows(arr);
	};

	const submit = async () => {
		try {
			setLoading(true);
			if (!follows.length) return navigate("/finish");

			const publish = await ark.newContactList({
				tags: follows.map((item) => {
					if (item.startsWith("npub1"))
						return ["p", nip19.decode(item).data as string];
					return ["p", item];
				}),
			});

			if (publish) {
				setLoading(false);
				return navigate("/finish");
			}
		} catch (e) {
			setLoading(false);
			toast.error(String(e));
		}
	};

	return (
		<motion.div className="w-full h-full flex flex-col">
			<div className="h-12 shrink-0 px-8 border-b border-neutral-100 dark:border-neutral-900 flex font-medium text-neutral-700 dark:text-neutral-600 w-full items-center">
				Dive into the nostrverse
			</div>
			<div className="w-full flex-1 mb-0 min-h-0 flex flex-col justify-between h-full">
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					className="flex-1 overflow-y-auto px-8"
				>
					<p className="leading-snug text-neutral-700 dark:text-neutral-500 my-4">
						Nostr is fun when we are together. Try following some users that
						interest you to build up your timeline.
					</p>
					<Accordion.Root type="single" defaultValue="recommended" collapsible>
						<Accordion.Item
							value="recommended"
							className="mb-3 overflow-hidden rounded-xl"
						>
							<Accordion.Trigger className="flex h-11 w-full items-center justify-between px-3 rounded-t-xl font-medium bg-neutral-50 dark:bg-neutral-950">
								Recommended
								<ChevronDownIcon className="size-4" />
							</Accordion.Trigger>
							<Accordion.Content>
								<div className="flex w-full flex-col overflow-y-auto rounded-b-xl px-3 bg-neutral-100 dark:bg-neutral-900">
									{POPULAR_USERS.map((pubkey) => (
										<div
											key={pubkey}
											className="flex h-max w-full shrink-0 flex-col my-3 gap-4 overflow-hidden rounded-lg bg-white dark:bg-black"
										>
											<User pubkey={pubkey} variant="large" />
											<div className="h-16 shrink-0 px-3 flex items-center border-t border-neutral-100 dark:border-neutral-900">
												<button
													type="button"
													onClick={() => toggleFollow(pubkey)}
													className={cn(
														"inline-flex h-9 shrink-0 w-28 items-center justify-center gap-1 rounded-lg font-medium",
														follows.includes(pubkey)
															? "text-red-500 bg-red-100 hover:text-white hover:bg-red-500"
															: "text-blue-500 bg-blue-100 hover:text-white hover:bg-blue-500",
													)}
												>
													{follows.includes(pubkey) ? (
														<>
															<CancelIcon className="size-4" />
															Unfollow
														</>
													) : (
														<>
															<PlusIcon className="size-4" />
															Follow
														</>
													)}
												</button>
											</div>
										</div>
									))}
								</div>
							</Accordion.Content>
						</Accordion.Item>
						<Accordion.Item
							value="trending"
							className="mb-3 overflow-hidden rounded-xl"
						>
							<Accordion.Trigger className="flex h-11 w-full items-center justify-between px-3 rounded-t-xl font-medium bg-neutral-50 dark:bg-neutral-950">
								Trending users
								<ChevronDownIcon className="size-4" />
							</Accordion.Trigger>
							<Accordion.Content>
								<div className="flex w-full flex-col overflow-y-auto rounded-b-xl px-3 bg-neutral-100 dark:bg-neutral-900">
									{isLoading ? (
										<div className="flex h-full w-full items-center justify-center">
											<LoaderIcon className="size-4 animate-spin" />
										</div>
									) : isError ? (
										<div className="flex h-full w-full items-center justify-center">
											Error. Cannot get trending users
										</div>
									) : (
										data?.profiles.map((item: { pubkey: string }) => (
											<div
												key={item.pubkey}
												className="flex h-max w-full shrink-0 flex-col my-3 gap-4 overflow-hidden rounded-lg bg-white dark:bg-black"
											>
												<User pubkey={item.pubkey} variant="large" />
												<div className="h-16 shrink-0 px-3 flex items-center border-t border-neutral-100 dark:border-neutral-900">
													<button
														type="button"
														onClick={() => toggleFollow(item.pubkey)}
														className={cn(
															"inline-flex h-9 shrink-0 w-28 items-center justify-center gap-1 rounded-lg font-medium",
															follows.includes(item.pubkey)
																? "text-red-500 bg-red-100 hover:text-white hover:bg-red-500"
																: "text-blue-500 bg-blue-100 hover:text-white hover:bg-blue-500",
														)}
													>
														{follows.includes(item.pubkey) ? (
															<>
																<CancelIcon className="size-4" />
																Unfollow
															</>
														) : (
															<>
																<PlusIcon className="size-4" />
																Follow
															</>
														)}
													</button>
												</div>
											</div>
										))
									)}
								</div>
							</Accordion.Content>
						</Accordion.Item>
						<Accordion.Item
							value="lume"
							className="mb-3 overflow-hidden rounded-xl"
						>
							<Accordion.Trigger className="flex h-11 w-full items-center justify-between px-3 rounded-t-xl font-medium bg-neutral-50 dark:bg-neutral-950">
								Lume HQ
								<ChevronDownIcon className="size-4" />
							</Accordion.Trigger>
							<Accordion.Content>
								<div className="flex w-full flex-col overflow-y-auto rounded-b-xl px-3 bg-neutral-100 dark:bg-neutral-900">
									{LUME_USERS.map((pubkey) => (
										<div
											key={pubkey}
											className="flex h-max w-full shrink-0 flex-col my-3 gap-4 overflow-hidden rounded-lg bg-white dark:bg-black"
										>
											<User pubkey={pubkey} variant="large" />
											<div className="h-16 shrink-0 px-3 flex items-center border-t border-neutral-100 dark:border-neutral-900">
												<button
													type="button"
													onClick={() => toggleFollow(pubkey)}
													className={cn(
														"inline-flex h-9 shrink-0 w-28 items-center justify-center gap-1 rounded-lg font-medium",
														follows.includes(pubkey)
															? "text-red-500 bg-red-100 hover:text-white hover:bg-red-500"
															: "text-blue-500 bg-blue-100 hover:text-white hover:bg-blue-500",
													)}
												>
													{follows.includes(pubkey) ? (
														<>
															<CancelIcon className="size-4" />
															Unfollow
														</>
													) : (
														<>
															<PlusIcon className="size-4" />
															Follow
														</>
													)}
												</button>
											</div>
										</div>
									))}
								</div>
							</Accordion.Content>
						</Accordion.Item>
					</Accordion.Root>
				</motion.div>
				<div className="h-16 w-full shrink-0 flex items-center px-8 justify-center gap-2 border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-950">
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="inline-flex h-9 flex-1 gap-2 shrink-0 items-center justify-center rounded-lg bg-neutral-100 font-medium dark:bg-neutral-900 dark:hover:bg-neutral-800 hover:bg-blue-200"
					>
						<ArrowLeftIcon className="size-4" />
						Back
					</button>
					<button
						type="button"
						onClick={() => submit()}
						className="inline-flex h-9 flex-1 shrink-0 items-center justify-center rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
					>
						{loading ? (
							<LoaderIcon className="size-4 animate-spin" />
						) : (
							"Continue"
						)}
					</button>
				</div>
			</div>
		</motion.div>
	);
}
