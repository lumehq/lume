import { RelayContext } from "@shared/relayProvider";

import LikeIcon from "@icons/like";

import { WRITEONLY_RELAYS } from "@stores/constants";

import { dateToUnix } from "@utils/date";
import { useActiveAccount } from "@utils/hooks/useActiveAccount";

import { getEventHash, getSignature } from "nostr-tools";
import { useContext, useEffect, useState } from "react";

export default function NoteLike({
	id,
	pubkey,
	likes,
}: { id: string; pubkey: string; likes: number }) {
	const pool: any = useContext(RelayContext);
	const { account, isLoading, isError } = useActiveAccount();

	const [count, setCount] = useState(0);

	const submitEvent = (e: any) => {
		e.stopPropagation();

		if (!isLoading && !isError && account) {
			const event: any = {
				content: "+",
				kind: 7,
				tags: [
					["e", id],
					["p", pubkey],
				],
				created_at: dateToUnix(),
				pubkey: account.pubkey,
			};
			event.id = getEventHash(event);
			event.sig = getSignature(event, account.privkey);
			// publish event to all relays
			pool.publish(event, WRITEONLY_RELAYS);
			// update state
			setCount(count + 1);
		} else {
			console.log("error");
		}
	};

	useEffect(() => {
		setCount(likes);
	}, [likes]);

	return (
		<button
			type="button"
			onClick={(e) => submitEvent(e)}
			className="group inline-flex items-center gap-1.5"
		>
			<LikeIcon
				width={16}
				height={16}
				className="text-zinc-400 group-hover:text-rose-400"
			/>
			<span className="text-base leading-none text-zinc-400 group-hover:text-white">
				{count}
			</span>
		</button>
	);
}
