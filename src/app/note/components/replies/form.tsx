import { Image } from "@shared/image";
import { RelayContext } from "@shared/relayProvider";

import { WRITEONLY_RELAYS } from "@stores/constants";

import { dateToUnix } from "@utils/date";
import { useActiveAccount } from "@utils/hooks/useActiveAccount";

import { getEventHash, signEvent } from "nostr-tools";
import { useContext, useState } from "react";

export default function NoteReplyForm({ id }: { id: string }) {
	const pool: any = useContext(RelayContext);
	const { account, isLoading, isError } = useActiveAccount();

	const [value, setValue] = useState("");
	const profile = account ? JSON.parse(account.metadata) : null;

	const submitEvent = () => {
		if (!isLoading && !isError && account) {
			const event: any = {
				content: value,
				created_at: dateToUnix(),
				kind: 1,
				pubkey: account.pubkey,
				tags: [["e", id]],
			};
			event.id = getEventHash(event);
			event.sig = signEvent(event, account.privkey);

			// publish note
			pool.publish(event, WRITEONLY_RELAYS);
			// reset form
			setValue("");
		} else {
			console.log("error");
		}
	};

	return (
		<div className="flex gap-2.5 px-3 py-4">
			<div>
				<div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md">
					<Image
						src={profile?.picture}
						alt={account?.pubkey}
						className="h-9 w-9 rounded-md object-cover"
					/>
				</div>
			</div>
			<div className="relative h-24 w-full flex-1 overflow-hidden before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-fuchsia-500 before:opacity-0 before:ring-2 before:ring-fuchsia-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-fuchsia-500/100 dark:focus-within:after:shadow-fuchsia-500/20">
				<div>
					<textarea
						name="content"
						onChange={(e) => setValue(e.target.value)}
						placeholder="Reply to this thread..."
						className="relative h-24 w-full resize-none rounded-md border border-black/5 px-3.5 py-3 text-sm shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-500"
						spellCheck={false}
					/>
				</div>
				<div className="absolute bottom-2 w-full px-2">
					<div className="flex w-full items-center justify-between bg-zinc-800">
						<div className="flex items-center gap-2 divide-x divide-zinc-700" />
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => submitEvent()}
								disabled={value.length === 0 ? true : false}
								className="inline-flex h-8 w-16 items-center justify-center rounded-md bg-fuchsia-500 px-4 text-sm font-medium shadow-button hover:bg-fuchsia-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
							>
								Reply
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
