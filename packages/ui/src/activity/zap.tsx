import { compactNumber, formatCreatedAt } from "@lume/utils";
import { NDKEvent, zapInvoiceFromEvent } from "@nostr-dev-kit/ndk";
import { User } from "../user";
import { ActivityRootNote } from "./rootNote";

export function ZapActivity({ event }: { event: NDKEvent }) {
	const zapEventId = event.tags.find((tag) => tag[0] === "e")[1];
	const invoice = zapInvoiceFromEvent(event);

	return (
		<div className="h-full pb-3 flex flex-col justify-between">
			<div className="h-14 border-b border-neutral-100 dark:border-neutral-900 flex flex-col items-center justify-center px-3">
				<h3 className="text-center font-semibold leading-tight">Zap</h3>
				<p className="text-sm text-blue-500 font-medium leading-tight">
					@ Someone love your note
				</p>
			</div>
			<div className="px-3">
				<div className="flex flex-col gap-3">
					<User
						pubkey={event.pubkey}
						variant="notify2"
						subtext={`${compactNumber.format(invoice.amount)} sats`}
					/>
					<div className="flex items-center gap-3">
						<p className="text-teal-500 font-medium">Zapped</p>
						<div className="flex-1 h-px bg-teal-300" />
						<div className="w-4 shrink-0 h-px bg-teal-300" />
					</div>
				</div>
				<div className="mt-3 flex flex-col gap-3">
					<ActivityRootNote eventId={zapEventId} />
				</div>
			</div>
		</div>
	);
}
