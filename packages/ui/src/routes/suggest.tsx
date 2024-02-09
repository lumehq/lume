import { User } from "@lume/ark";
import { ArrowLeftIcon, ArrowRightIcon, LoaderIcon } from "@lume/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { WindowVirtualizer } from "virtua";

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

export function SuggestRoute({ queryKey }: { queryKey: string }) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { t } = useTranslation();
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

	const submit = async () => {
		try {
			await queryClient.refetchQueries({ queryKey: [queryKey] });
			return navigate("/", { replace: true });
		} catch (e) {
			toast.error(String(e));
		}
	};

	return (
		<div className="pb-5 overflow-y-auto">
			<WindowVirtualizer>
				<div className="h-11 bg-neutral-50 dark:bg-neutral-950 border-b flex items-center justify-start gap-2 px-3 border-neutral-100 dark:border-neutral-900 mb-3">
					<button
						type="button"
						className="size-9 hover:bg-neutral-100 hover:text-blue-500 dark:hover:bg-neutral-900 rounded-lg inline-flex items-center justify-center"
						onClick={() => navigate(-1)}
					>
						<ArrowLeftIcon className="size-5" />
					</button>
					<button
						type="button"
						className="size-9 hover:bg-neutral-100 hover:text-blue-500 dark:hover:bg-neutral-900 rounded-lg inline-flex items-center justify-center"
						onClick={() => navigate(1)}
					>
						<ArrowRightIcon className="size-5" />
					</button>
				</div>
				<div className="relative px-3">
					<div className="flex items-center h-16">
						<h3 className="font-semibold text-xl">{t("suggestion.title")}</h3>
					</div>
					<div className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-900">
						{isLoading ? (
							<div className="flex h-44 w-full items-center justify-center">
								<LoaderIcon className="size-4 animate-spin" />
							</div>
						) : isError ? (
							<div className="flex h-44 w-full items-center justify-center">
								{t("suggestion.error")}
							</div>
						) : (
							data?.profiles.map((item: { pubkey: string }) => (
								<div
									key={item.pubkey}
									className="py-5 h-max w-full overflow-hidden"
								>
									<User.Provider pubkey={item.pubkey}>
										<User.Root>
											<div className="flex h-full w-full flex-col gap-2">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2.5">
														<User.Avatar className="size-10 shrink-0 rounded-lg" />
														<User.Name className="max-w-[15rem] truncate font-semibold leadning-tight" />
													</div>
													<User.Button
														target={item.pubkey}
														className="w-20 h-8 text-sm font-medium bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg inline-flex items-center justify-center"
													/>
												</div>
												<User.About className="mt-1 line-clamp-3 text-neutral-800 dark:text-neutral-400 max-w-none select-text" />
											</div>
										</User.Root>
									</User.Provider>
								</div>
							))
						)}
					</div>
					<div className="sticky z-10 flex items-center justify-center w-full bottom-0">
						<button
							type="button"
							onClick={submit}
							className="inline-flex items-center justify-center gap-2 px-6 font-medium shadow-xl dark:shadow-none shadow-neutral-500/50 text-white transform bg-blue-500 rounded-full active:translate-y-1 w-44 h-11 hover:bg-blue-600 focus:outline-none disabled:cursor-not-allowed"
						>
							{t("suggestion.button")}
						</button>
					</div>
				</div>
			</WindowVirtualizer>
		</div>
	);
}
