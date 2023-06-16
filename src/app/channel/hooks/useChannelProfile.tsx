import { getChannel, updateChannelMetadata } from "@libs/storage";
import { RelayContext } from "@shared/relayProvider";
import { useContext } from "react";
import useSWR from "swr";
import useSWRSubscription from "swr/subscription";

const fetcher = async ([, id]) => {
	const result = await getChannel(id);
	if (result) {
		return result;
	} else {
		return null;
	}
};

export function useChannelProfile(id: string) {
	const ndk = useContext(RelayContext);
	const { data, mutate } = useSWR(["channel-metadata", id], fetcher);

	useSWRSubscription(data ? ["channel-metadata", id] : null, () => {
		// subscribe to channel
		const sub = ndk.subscribe(
			{
				"#e": [id],
				kinds: [41],
			},
			{
				closeOnEose: true,
			},
		);

		sub.addListener("event", (event: { content: string }) => {
			// update in local database
			updateChannelMetadata(id, event.content);
			// revaildate
			mutate();
		});

		return () => {
			sub.stop();
		};
	});

	return data;
}
