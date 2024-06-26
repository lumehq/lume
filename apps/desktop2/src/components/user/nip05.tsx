import { VerifiedIcon } from "@lume/icons";
import { displayLongHandle, displayNpub } from "@lume/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "./provider";
import { NostrQuery } from "@lume/system";
import { experimental_createPersister } from "@tanstack/query-persist-client-core";

export function UserNip05() {
	const user = useUserContext();
	const { isLoading, data: verified } = useQuery({
		queryKey: ["nip05", user?.pubkey],
		queryFn: async () => {
			if (!user.profile?.nip05?.length) return false;

			const verify = await NostrQuery.verifyNip05(
				user.pubkey,
				user.profile?.nip05,
			);

			return verify;
		},
		enabled: !!user.profile?.nip05,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		staleTime: Number.POSITIVE_INFINITY,
		retry: false,
		persister: experimental_createPersister({
			storage: localStorage,
			maxAge: 1000 * 60 * 60 * 72, // 72 hours
		}),
	});

	if (!user.profile?.nip05?.length) return;

	return (
		<Tooltip.Provider>
			<Tooltip.Root delayDuration={150}>
				<Tooltip.Trigger>
					{!isLoading && verified ? (
						<VerifiedIcon className="text-teal-500 size-4" />
					) : null}
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content className="inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-950 px-3.5 text-sm font-medium text-neutral-50 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-50 dark:text-neutral-950">
						{!user.profile?.nip05
							? displayNpub(user.pubkey, 16)
							: user.profile?.nip05.length > 50
								? displayLongHandle(user.profile?.nip05)
								: user.profile.nip05?.replace("_@", "")}
						<Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}
