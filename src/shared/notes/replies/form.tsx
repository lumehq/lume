import { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { Button } from "@shared/button";
import { Image } from "@shared/image";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { DEFAULT_AVATAR } from "@stores/constants";
import { dateToUnix } from "@utils/date";
import { useProfile } from "@utils/hooks/useProfile";
import { useContext, useState } from "react";

export function NoteReplyForm({ id }: { id: string }) {
	const ndk = useContext(RelayContext);
	const account = useActiveAccount((state) => state.account);

	const { status, user } = useProfile(account.npub);

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
					className="relative h-20 w-full resize-none rounded-md px-5 py-3 text-base bg-transparent !outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
					spellCheck={false}
				/>
			</div>
			<div className="border-t border-zinc-800 w-full py-3 px-5">
				{status === "loading" ? (
					<div>
						<p>Loading...</p>
					</div>
				) : (
					<div className="flex w-full items-center justify-between">
						<div className="inline-flex items-center gap-2">
							<div className="relative h-9 w-9 shrink-0 rounded">
								<Image
									src={user?.image}
									fallback={DEFAULT_AVATAR}
									alt={account.npub}
									className="h-9 w-9 rounded-md bg-white object-cover"
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
							<Button
								onClick={() => submitEvent()}
								disabled={value.length === 0 ? true : false}
								preset="publish"
							>
								Reply
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
