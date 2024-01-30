import { User } from "@lume/ark";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useTranslation } from "react-i18next";
import { ActivityRootNote } from "./rootNote";

export function ActivitySingleRepost({ event }: { event: NDKEvent }) {
	const { t } = useTranslation();
	const repostId = event.tags.find((el) => el[0] === "e")[1];

	return (
		<div className="pb-3 flex flex-col">
			<div className="h-14 shrink-0 border-b border-neutral-100 dark:border-neutral-900 flex flex-col items-center justify-center px-3">
				<h3 className="text-center font-semibold leading-tight">
					{t("activity.boost")}
				</h3>
				<p className="text-sm text-blue-500 font-medium leading-tight">
					{t("activity.boostSubtitle")}
				</p>
			</div>
			<div className="flex-1 min-h-0">
				<div className="max-w-xl mx-auto py-6 flex flex-col items-center gap-6">
					<User.Provider pubkey={event.pubkey}>
						<User.Root>
							<User.Avatar className="size-10 shrink-0 rounded-lg object-cover" />
						</User.Root>
					</User.Provider>
					<div className="flex flex-col items-center gap-3">
						<div className="h-4 w-px bg-blue-500" />
						<h3 className="font-semibold capitalize">{t("activity.repost")}</h3>
						<div className="h-4 w-px bg-blue-500" />
					</div>
					<ActivityRootNote eventId={repostId} />
				</div>
			</div>
		</div>
	);
}
