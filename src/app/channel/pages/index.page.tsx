import ChannelBlackList from "@app/channel/components/blacklist";
import ChannelMembers from "@app/channel/components/members";
import ChannelMessageForm from "@app/channel/components/messages/form";
import ChannelMetadata from "@app/channel/components/metadata";
import ChannelUpdateModal from "@app/channel/components/updateModal";

import { RelayContext } from "@shared/relayProvider";

import { channelMessagesAtom, channelReplyAtom } from "@stores/channel";
import { READONLY_RELAYS } from "@stores/constants";

import { dateToUnix, getHourAgo } from "@utils/date";
import { useActiveAccount } from "@utils/hooks/useActiveAccount";
import { usePageContext } from "@utils/hooks/usePageContext";
import { getActiveBlacklist, getBlacklist } from "@utils/storage";
import { arrayObjToPureArr } from "@utils/transform";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Suspense, lazy, useContext, useEffect, useRef } from "react";
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

const ChannelMessageList = lazy(
	() => import("@app/channel/components/messageList"),
);

export function Page() {
	const pool: any = useContext(RelayContext);
	const pageContext = usePageContext();
	const searchParams: any = pageContext.urlParsed.search;

	const channelID = searchParams.id;
	const channelPubkey = searchParams.channelpub;

	const { account, isLoading, isError } = useActiveAccount();
	const { data: muted } = useSWR(
		!isLoading && !isError && account ? ["muted", account.id] : null,
		fetchMuted,
	);
	const { data: hided } = useSWR(
		!isLoading && !isError && account ? ["hided", account.id] : null,
		fetchHided,
	);

	const setChannelMessages = useSetAtom(channelMessagesAtom);
	const resetChannelMessages = useResetAtom(channelMessagesAtom);
	const resetChannelReply = useResetAtom(channelReplyAtom);

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
					if (hided.includes(event.id)) {
						message["hide"] = true;
					} else {
						message["hide"] = false;
					}
					if (!muted.array.includes(event.pubkey)) {
						setChannelMessages((prev) => [...prev, message]);
					}
				},
			);

			return () => {
				unsubscribe();
			};
		},
	);

	useEffect(() => {
		let ignore = false;

		if (!ignore) {
			// reset channel reply
			resetChannelReply();
			// reset channel messages
			resetChannelMessages();
		}

		return () => {
			ignore = true;
		};
	});

	return (
		<div className="flex h-full flex-col justify-between gap-2">
			<div className="flex h-11 w-full shrink-0 items-center justify-between">
				<div>
					<ChannelMetadata id={channelID} pubkey={channelPubkey} />
				</div>
				<div className="flex items-center gap-2">
					<ChannelMembers />
					{!muted ? <></> : <ChannelBlackList blacklist={muted.original} />}
					{!isLoading && !isError && account ? (
						account.pubkey === channelPubkey && (
							<ChannelUpdateModal id={channelID} />
						)
					) : (
						<></>
					)}
				</div>
			</div>
			<div className="relative flex w-full flex-1 flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-900 shadow-input shadow-black/20">
				<Suspense fallback={<p>Loading...</p>}>
					<ChannelMessageList />
				</Suspense>
				<div className="inline-flex shrink-0 p-3">
					<ChannelMessageForm channelID={channelID} />
				</div>
			</div>
		</div>
	);
}
