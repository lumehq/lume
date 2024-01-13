import { User } from "@lume/ark";
import { compactNumber } from "@lume/utils";
import { NDKEvent, zapInvoiceFromEvent } from "@nostr-dev-kit/ndk";
import { ActivityRootNote } from "./rootNote";

export function ActivitySingleZap({ event }: { event: NDKEvent }) {
	const zapEventId = event.tags.find((el) => el[0] === "e")[1];
	const invoice = zapInvoiceFromEvent(event);

	return (
		<div className="h-full w-full flex flex-col justify-between">
			<div className="h-14 border-b border-neutral-100 dark:border-neutral-900 flex flex-col items-center justify-center px-3">
				<h3 className="text-center font-semibold leading-tight">
					Conversation
				</h3>
				<p className="text-sm text-blue-500 font-medium leading-tight">
					@ Someone has replied to your note
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
						<h3 className="font-semibold">
							Zap you {compactNumber.format(invoice.amount)} sats for
						</h3>
						<div className="h-4 w-px bg-blue-500" />
					</div>
					<ActivityRootNote eventId={zapEventId} />
				</div>
			</div>
		</div>
	);
}
