import { Image } from "@shared/image";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { useChannels } from "@stores/channels";
import { useChatMessages, useChats } from "@stores/chats";
import { DEFAULT_AVATAR, READONLY_RELAYS } from "@stores/constants";
import { dateToUnix } from "@utils/date";
import { usePageContext } from "@utils/hooks/usePageContext";
import { useProfile } from "@utils/hooks/useProfile";
import { sendNativeNotification } from "@utils/notification";
import { createNote } from "@utils/storage";
import { useContext } from "react";
import useSWRSubscription from "swr/subscription";

export function ActiveAccount({ data }: { data: any }) {
	const pool: any = useContext(RelayContext);
	const account = useActiveAccount((state: any) => state.account);

	const pageContext = usePageContext();
	const pathname: any = pageContext.urlParsed.pathname;

	const isChatPage = pathname.includes("/chat");
	const isChannelPage = pathname.includes("/channel");
	// const notSpacePage = pathnames.includes("/space") ? false : true;

	const lastLogin = useActiveAccount((state: any) => state.lastLogin);
	const notifyChat = useChats((state: any) => state.add);
	const saveChat = useChatMessages((state: any) => state.add);
	const notifyChannel = useChannels((state: any) => state.add);

	const { user } = useProfile(data.pubkey);

	useSWRSubscription(
		user && lastLogin > 0 ? ["activeAccount", data.pubkey] : null,
		() => {
			const follows = JSON.parse(account.follows);
			// subscribe to channel
			const unsubscribe = pool.subscribe(
				[
					{
						kinds: [1, 6],
						authors: follows,
						since: dateToUnix(),
					},
					{
						"#p": [data.pubkey],
						since: lastLogin,
					},
				],
				READONLY_RELAYS,
				(event) => {
					switch (event.kind) {
						case 1:
						case 6: {
							createNote(
								event.id,
								account.id,
								event.pubkey,
								event.kind,
								event.tags,
								event.content,
								event.created_at,
							);
							break;
						}
						case 4:
							if (!isChatPage) {
								// save
								saveChat(data.pubkey, event);
								// update state
								notifyChat(event.pubkey);
								// send native notifiation
								sendNativeNotification("You've received new message");
							}
							break;
						case 42:
							if (!isChannelPage) {
								// update state
								notifyChannel(event);
								// send native notifiation
								sendNativeNotification(event.content);
							}
							break;
						default:
							break;
					}
				},
			);

			return () => {
				unsubscribe();
			};
		},
	);

	return (
		<button type="button" className="relative h-11 w-11 overflow-hidden">
			<Image
				src={user?.picture || DEFAULT_AVATAR}
				alt={data.npub}
				className="h-11 w-11 rounded-md object-cover"
			/>
		</button>
	);
}
