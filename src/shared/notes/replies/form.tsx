import { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { Image } from "@shared/image";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { DEFAULT_AVATAR } from "@stores/constants";
import { dateToUnix } from "@utils/date";
import { useProfile } from "@utils/hooks/useProfile";
import { useContext, useState } from "react";

export function NoteReplyForm({ id }: { id: string }) {
	const ndk = useContext(RelayContext);
	const account = useActiveAccount((state: any) => state.account);
	const { user } = useProfile(account.npub);

	const [value, setValue] = useState("");

	const submitEvent = () => {
		const signer = new NDKPrivateKeySigner(account.privkey);
		ndk.signer = signer;

		const event = new NDKEvent(ndk);
		// build event
		event.content = value;
		event.kind = 1;
		event.created_at = dateToUnix();
		event.pubkey = account.pubkey;
		event.tags = [["e", id]];

		// publish event
		event.publish();

		// reset form
		setValue("");
	};

	return (
		<div className="flex flex-col">
			<div className="relative w-full flex-1 overflow-hidden">
				<textarea
					name="content"
					onChange={(e) => setValue(e.target.value)}
					placeholder="Reply to this thread..."
					className="relative h-20 w-full resize-none rounded-md px-5 py-5 text-base bg-transparent !outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
					spellCheck={false}
				/>
			</div>
			<div className="border-t border-zinc-800 w-full py-3 px-5">
				<div className="flex w-full items-center justify-between">
					<div className="inline-flex items-center gap-2">
						<div className="relative h-8 w-8 shrink-0 rounded">
							<Image
								src={user?.image || DEFAULT_AVATAR}
								alt={account.npub}
								className="h-8 w-8 rounded bg-white object-cover"
							/>
						</div>
						<div>
							<p className="mb-px leading-none text-sm text-zinc-400">
								Reply as
							</p>
							<p className="leading-none text-sm font-medium text-zinc-100">
								{user?.nip05 || user?.name}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => submitEvent()}
							disabled={value.length === 0 ? true : false}
							className="inline-flex h-8 w-16 items-center justify-center rounded-md bg-fuchsia-500 px-4 text-base font-medium hover:bg-fuchsia-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
						>
							Reply
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
