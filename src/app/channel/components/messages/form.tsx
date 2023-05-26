import UserReply from "@app/channel/components/messages/userReply";
import CancelIcon from "@icons/cancel";
import { ImagePicker } from "@shared/form/imagePicker";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { channelContentAtom, channelReplyAtom } from "@stores/channel";
import { WRITEONLY_RELAYS } from "@stores/constants";
import { dateToUnix } from "@utils/date";
import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { getEventHash, getSignature } from "nostr-tools";
import { useContext } from "react";

export default function ChannelMessageForm({
	channelID,
}: { channelID: string | string[] }) {
	const pool: any = useContext(RelayContext);
	const account = useActiveAccount((state: any) => state.account);

	const [value, setValue] = useAtom(channelContentAtom);
	const resetValue = useResetAtom(channelContentAtom);

	const channelReply = useAtomValue(channelReplyAtom);
	const resetChannelReply = useResetAtom(channelReplyAtom);

	const submitEvent = () => {
		let tags: any[][];

		if (channelReply.id !== null) {
			tags = [
				["e", channelID, "", "root"],
				["e", channelReply.id, "", "reply"],
				["p", channelReply.pubkey, ""],
			];
		} else {
			tags = [["e", channelID, "", "root"]];
		}

		if (account) {
			const event: any = {
				content: value,
				created_at: dateToUnix(),
				kind: 42,
				pubkey: account.pubkey,
				tags: tags,
			};

			event.id = getEventHash(event);
			event.sig = getSignature(event, account.privkey);

			// publish note
			pool.publish(event, WRITEONLY_RELAYS);

			// reset state
			resetValue();
			// reset channel reply
			resetChannelReply();
		} else {
			console.log("error");
		}
	};

	const handleEnterPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			submitEvent();
		}
	};

	const stopReply = () => {
		resetChannelReply();
	};

	return (
		<div
			className={`relative ${
				channelReply.id ? "h-36" : "h-24"
			} w-full overflow-hidden before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-fuchsia-500 before:opacity-0 before:ring-2 before:ring-fuchsia-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-fuchsia-500/100 dark:focus-within:after:shadow-fuchsia-500/20`}
		>
			{channelReply.id && (
				<div className="absolute left-0 top-0 z-10 h-14 w-full p-[2px]">
					<div className="flex h-full w-full items-center justify-between rounded-t-md border-b border-zinc-700/70 bg-zinc-900 px-3">
						<div className="flex w-full flex-col">
							<UserReply pubkey={channelReply.pubkey} />
							<div className="-mt-3.5 pl-[32px]">
								<div className="text-base text-white">
									{channelReply.content}
								</div>
							</div>
						</div>
						<button
							type="button"
							onClick={() => stopReply()}
							className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-800"
						>
							<CancelIcon width={12} height={12} className="text-white" />
						</button>
					</div>
				</div>
			)}
			<textarea
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={handleEnterPress}
				spellCheck={false}
				placeholder="Message"
				className={`relative ${
					channelReply.id ? "h-36 pt-16" : "h-24 pt-3"
				} w-full resize-none rounded-lg border border-black/5 px-3.5 pb-3 text-base shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-white dark:shadow-black/10 dark:placeholder:text-zinc-500`}
			/>
			<div className="absolute bottom-2 w-full px-2">
				<div className="flex w-full items-center justify-between bg-zinc-800">
					<div className="flex items-center gap-2 divide-x divide-zinc-700">
						<ImagePicker type="channel" />
						<div className="flex items-center gap-2 pl-2" />
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => submitEvent()}
							disabled={value.length === 0 ? true : false}
							className="inline-flex h-8 w-16 items-center justify-center rounded-md bg-fuchsia-500 px-4 text-base font-medium shadow-button hover:bg-fuchsia-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
						>
							Send
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
