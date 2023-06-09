import { RelayContext } from "@shared/relayProvider";
import { getChannel, updateChannelMetadata } from "@utils/storage";
import { useContext } from "react";
import useSWR, { useSWRConfig } from "swr";
import useSWRSubscription from "swr/subscription";

const fetcher = async ([, id]) => {
	const result = await getChannel(id);
	if (result) {
		return result;
	} else {
		return null;
	}
};

export function useChannelProfile(id: string, channelPubkey: string) {
	const ndk = useContext(RelayContext);

	const { mutate } = useSWRConfig();
	const { data, isLoading } = useSWR(["channel-metadata", id], fetcher);

	useSWRSubscription(
		!isLoading && data ? ["channel-metadata", id] : null,
		([, key]) => {
			// subscribe to channel
			const sub = ndk.subscribe(
				{
					"#e": [key],
					authors: [channelPubkey],
					kinds: [41],
				},
				{
					closeOnEose: true,
				},
			);

			sub.addListener("event", (event: { content: string }) => {
				// update in local database
				updateChannelMetadata(key, event.content);
				// revaildate
				mutate(["channel-metadata", key]);
			});

			return () => {
				sub.stop();
			};
		},
	);

	return data;
}
