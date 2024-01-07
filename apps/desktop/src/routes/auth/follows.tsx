import { useArk } from "@lume/ark";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CancelIcon,
	ChevronDownIcon,
	LoaderIcon,
	PlusIcon,
} from "@lume/icons";
import { User } from "@lume/ui";
import * as Accordion from "@radix-ui/react-accordion";
import { useQuery } from "@tanstack/react-query";
import { nip19 } from "nostr-tools";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

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

export function FollowsScreen() {
	const ark = useArk();
	const navigate = useNavigate();

	const { status, data } = useQuery({
		queryKey: ["trending-profiles-widget"],
		queryFn: async () => {
			const res = await fetch("https://api.nostr.band/v0/trending/profiles");
			if (!res.ok) {
				throw new Error("Error");
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
			if (!follows.length) return navigate("/auth/finish");

			const publish = await ark.newContactList({
				tags: follows.map((item) => {
					if (item.startsWith("npub1"))
						return ["p", nip19.decode(item).data as string];
					return ["p", item];
				}),
			});

			if (publish) {
				setLoading(false);
				return navigate("/auth/finish");
			}
		} catch (e) {
			setLoading(false);
			toast.error(e);
		}
	};

	return (
		<div className="relative flex h-full w-full items-center justify-center">
			<div className="mx-auto flex w-full max-w-md flex-col gap-10">
				<div className="flex flex-col gap-3">
					<h1 className="text-2xl font-semibold text-center">
						Dive into the nostrverse
					</h1>
					<p className="text-lg font-medium leading-snug text-center text-neutral-600 dark:text-neutral-500">
						Try following some users that interest you
						<br />
						to build up your timeline.
					</p>
				</div>
				<Accordion.Root type="single" defaultValue="recommended" collapsible>
					<Accordion.Item
						value="recommended"
						className="mb-3 overflow-hidden rounded-xl"
					>
						<Accordion.Trigger className="flex h-14 w-full items-center justify-between rounded-t-xl px-3 font-medium bg-neutral-950">
							Popular users
							<ChevronDownIcon className="size-4" />
						</Accordion.Trigger>
						<Accordion.Content>
							<div className="flex h-[400px] w-full flex-col overflow-y-auto rounded-b-xl px-3 bg-neutral-950">
								{POPULAR_USERS.map((pubkey) => (
									<div
										key={pubkey}
										className="flex h-max w-full shrink-0 flex-col mb-3 p-3 gap-4 overflow-hidden rounded-lg bg-neutral-900"
									>
										<User pubkey={pubkey} variant="large" />
										<button
											type="button"
											onClick={() => toggleFollow(pubkey)}
											className={twMerge(
												"inline-flex h-9 shrink-0 w-full items-center justify-center gap-1 rounded-lg font-medium text-white",
												follows.includes(pubkey)
													? "bg-red-600 hover:bg-red-500"
													: "bg-blue-600 hover:bg-blue-500",
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
								))}
							</div>
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item
						value="trending"
						className="mb-3 overflow-hidden rounded-xl"
					>
						<Accordion.Trigger className="flex h-14 w-full items-center justify-between rounded-t-xl px-3 font-medium bg-neutral-950">
							Trending users
							<ChevronDownIcon className="size-4" />
						</Accordion.Trigger>
						<Accordion.Content>
							<div className="flex h-[400px] w-full flex-col overflow-y-auto rounded-b-xl px-3 bg-neutral-950">
								{status === "pending" ? (
									<div className="flex h-full w-full items-center justify-center">
										<LoaderIcon className="size-4 animate-spin" />
									</div>
								) : (
									data?.profiles.map(
										(item: {
											pubkey: string;
											profile: { content: string };
										}) => (
											<div
												key={item.pubkey}
												className="flex h-max w-full mb-3 p-3 gap-4 shrink-0 flex-col overflow-hidden rounded-lg bg-neutral-900"
											>
												<User pubkey={item.pubkey} variant="large" />
												<button
													type="button"
													onClick={() => toggleFollow(item.pubkey)}
													className={twMerge(
														"inline-flex h-9 shrink-0 w-full items-center justify-center gap-1 rounded-lg font-medium text-white",
														follows.includes(item.pubkey)
															? "bg-red-600 hover:bg-red-500"
															: "bg-blue-600 hover:bg-blue-500",
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
										),
									)
								)}
							</div>
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item
						value="lume"
						className="mb-3 overflow-hidden rounded-xl"
					>
						<Accordion.Trigger className="flex h-14 w-full items-center justify-between rounded-t-xl px-3 font-medium bg-neutral-950">
							Lume HQ
							<ChevronDownIcon className="size-4" />
						</Accordion.Trigger>
						<Accordion.Content>
							<div className="flex h-[400px] w-full flex-col gap-3 overflow-y-auto rounded-b-xl p-3 bg-neutral-950">
								{LUME_USERS.map((pubkey) => (
									<div
										key={pubkey}
										className="flex h-max w-full mb-3 p-3 gap-4 shrink-0 flex-col overflow-hidden rounded-lg bg-neutral-900"
									>
										<User pubkey={pubkey} variant="large" />
										<button
											type="button"
											onClick={() => toggleFollow(pubkey)}
											className={twMerge(
												"inline-flex h-9 shrink-0 w-full items-center justify-center gap-1 rounded-lg font-medium text-white",
												follows.includes(pubkey)
													? "bg-red-600 hover:bg-red-500"
													: "bg-blue-600 hover:bg-blue-500",
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
								))}
							</div>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>
			</div>
			<div className="absolute bottom-4 right-4 flex w-full items-center justify-end gap-2">
				<button
					type="button"
					onClick={submit}
					disabled={loading}
					className="inline-flex h-12 w-max items-center justify-center gap-2 rounded-xl bg-blue-500 px-3 font-semibold text-white hover:bg-blue-600"
				>
					{loading ? (
						<LoaderIcon className="size-4 animate-spin" />
					) : (
						<ArrowRightIcon className="size-4" />
					)}
					Continue
				</button>
			</div>
		</div>
	);
}
