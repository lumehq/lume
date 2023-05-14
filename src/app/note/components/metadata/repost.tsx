import { RelayContext } from "@shared/relayProvider";

import RepostIcon from "@icons/repost";

import { WRITEONLY_RELAYS } from "@stores/constants";

import { dateToUnix } from "@utils/date";
import { useActiveAccount } from "@utils/hooks/useActiveAccount";

import { getEventHash, signEvent } from "nostr-tools";
import { useContext, useEffect, useState } from "react";

export default function NoteRepost({
	id,
	pubkey,
	reposts,
}: { id: string; pubkey: string; reposts: number }) {
	const pool: any = useContext(RelayContext);
	const { account, isLoading, isError } = useActiveAccount();

	const [count, setCount] = useState(0);

	const submitEvent = (e: any) => {
		e.stopPropagation();

		if (!isLoading && !isError && account) {
			const event: any = {
				content: "",
				kind: 6,
				tags: [
					["e", id],
					["p", pubkey],
				],
				created_at: dateToUnix(),
				pubkey: account.pubkey,
			};
			event.id = getEventHash(event);
			event.sig = signEvent(event, account.privkey);
			// publish event to all relays
			pool.publish(event, WRITEONLY_RELAYS);
			// update state
			setCount(count + 1);
		} else {
			console.log("error");
		}
	};

	useEffect(() => {
		setCount(reposts);
	}, [reposts]);

	return (
		<button
			type="button"
			onClick={(e) => submitEvent(e)}
			className="group inline-flex w-min items-center gap-1.5"
		>
			<RepostIcon
				width={16}
				height={16}
				className="text-zinc-400 group-hover:text-blue-400"
			/>
			<span className="text-sm leading-none text-zinc-400 group-hover:text-zinc-200">
				{count}
			</span>
		</button>
	);
}
