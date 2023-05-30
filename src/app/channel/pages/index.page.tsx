import { ChannelBlackList } from "@app/channel/components/blacklist";
import { ChannelMembers } from "@app/channel/components/members";
import { ChannelMessageList } from "@app/channel/components/messageList";
import { ChannelMessageForm } from "@app/channel/components/messages/form";
import { ChannelMetadata } from "@app/channel/components/metadata";
import { ChannelUpdateModal } from "@app/channel/components/updateModal";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { useChannelMessages } from "@stores/channels";
import { READONLY_RELAYS } from "@stores/constants";
import { dateToUnix, getHourAgo } from "@utils/date";
import { usePageContext } from "@utils/hooks/usePageContext";
import { getActiveBlacklist, getBlacklist } from "@utils/storage";
import { arrayObjToPureArr } from "@utils/transform";
import { useContext, useRef } from "react";
import useSWR from "swr";
import useSWRSubscription from "swr/subscription";

const fetchMuted = async ([, id]) => {
	const res = await getBlacklist(id, 44);
	const array = arrayObjToPureArr(res);
	return { original: res, array: array };
};

const fetchHided = async ([, id]) => {
	const res = await getActiveBlacklist(id, 43);
	const array = arrayObjToPureArr(res);
	return array;
};

export function Page() {
	const pool: any = useContext(RelayContext);

	const pageContext = usePageContext();
	const searchParams: any = pageContext.urlParsed.search;
	const channelID = searchParams.id;
	const channelPubkey = searchParams.channelpub;

	const account: any = useActiveAccount((state: any) => state.account);
	const [addMessage, clear] = useChannelMessages((state: any) => [
		state.add,
		state.clear,
	]);

	const { data: muted } = useSWR(
		account ? ["muted", account.id] : null,
		fetchMuted,
	);
	const { data: hided } = useSWR(
		account ? ["hided", account.id] : null,
		fetchHided,
	);

	const now = useRef(new Date());

	useSWRSubscription(
		account && channelID && muted && hided ? ["channel", channelID] : null,
		([, key]) => {
			// subscribe to channel
			const unsubscribe = pool.subscribe(
				[
					{
						"#e": [key],
						kinds: [42],
						since: dateToUnix(getHourAgo(24, now.current)),
						limit: 20,
					},
				],
				READONLY_RELAYS,
				(event: { id: string; pubkey: string }) => {
					const message: any = event;

					// handle hide message
					if (hided.includes(event.id)) {
						message["hide"] = true;
					} else {
						message["hide"] = false;
					}

					// handle mute user
					if (muted.array.includes(event.pubkey)) {
						message["mute"] = true;
					} else {
						message["mute"] = false;
					}

					// add to store
					addMessage(message);
				},
			);

			return () => {
				unsubscribe();
				clear();
			};
		},
	);

	if (!account) return <div>Fuck SSR</div>;

	return (
		<div className="h-full w-full grid grid-cols-3">
			<div className="col-span-2 flex flex-col justify-between border-r border-zinc-900">
				<div
					data-tauri-drag-region
					className="h-11 w-full shrink-0 inline-flex items-center justify-center border-b border-zinc-900"
				>
					<h3 className="font-semibold text-zinc-100">Public Channel</h3>
				</div>
				<div className="w-full flex-1 p-3">
					<div className="flex h-full flex-col justify-between rounded-md bg-zinc-900 shadow-input shadow-black/20">
						<ChannelMessageList />
						<div className="inline-flex shrink-0 p-3">
							<ChannelMessageForm channelID={channelID} />
						</div>
					</div>
				</div>
			</div>
			<div className="col-span-1 flex flex-col">
				<div
					data-tauri-drag-region
					className="h-11 w-full shrink-0 inline-flex items-center justify-center border-b border-zinc-900"
				/>
				<div className="p-3 flex flex-col gap-3">
					<ChannelMetadata id={channelID} pubkey={channelPubkey} />
					<ChannelMembers />
					{muted && <ChannelBlackList blacklist={muted.original} />}
					{account && account.pubkey === channelPubkey && (
						<ChannelUpdateModal id={channelID} />
					)}
				</div>
			</div>
		</div>
	);
}
