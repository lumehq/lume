import { Image } from "@shared/image";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { useChannels } from "@stores/channels";
import { useChats } from "@stores/chats";
import { DEFAULT_AVATAR, READONLY_RELAYS } from "@stores/constants";
import { usePageContext } from "@utils/hooks/usePageContext";
import { useProfile } from "@utils/hooks/useProfile";
import { sendNativeNotification } from "@utils/notification";
import { useContext } from "react";
import useSWRSubscription from "swr/subscription";

export function ActiveAccount({ data }: { data: any }) {
	const pool: any = useContext(RelayContext);
	const pageContext = usePageContext();
	const pathnames: any = pageContext.urlParsed.pathname;

	const notChatPage = pathnames.includes("/chat") ? false : true;
	const notChannelPage = pathnames.includes("/channel") ? false : true;
	const notSpacePage = pathnames.includes("/space") ? false : true;

	const lastLogin = useActiveAccount((state: any) => state.lastLogin);
	const notifyChat = useChats((state: any) => state.add);
	const notifyChannel = useChannels((state: any) => state.add);

	const { user } = useProfile(data.pubkey);

	useSWRSubscription(
		user && lastLogin > 0 ? ["account", data.pubkey] : null,
		([, key]) => {
			// subscribe to channel
			const unsubscribe = pool.subscribe(
				[
					{
						"#p": [key],
						since: lastLogin,
					},
				],
				READONLY_RELAYS,
				(event) => {
					switch (event.kind) {
						case 1:
							break;
						case 4:
							if (notChatPage) {
								// update state
								notifyChat(event.pubkey);
								// send native notifiation
								sendNativeNotification("You've received new message");
							}
							break;
						case 42:
							if (notChannelPage) {
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
