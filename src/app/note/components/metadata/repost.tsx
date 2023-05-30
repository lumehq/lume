import { RepostIcon } from "@shared/icons";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { WRITEONLY_RELAYS } from "@stores/constants";
import { dateToUnix } from "@utils/date";
import { compactNumber } from "@utils/number";
import { getEventHash, getSignature } from "nostr-tools";
import { useContext, useEffect, useState } from "react";

export function NoteRepost({
	id,
	pubkey,
	reposts,
}: { id: string; pubkey: string; reposts: number }) {
	const pool: any = useContext(RelayContext);
	const account = useActiveAccount((state: any) => state.account);

	const [count, setCount] = useState(0);

	const submitEvent = (e: any) => {
		e.stopPropagation();

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
		event.sig = getSignature(event, account.privkey);

		// publish event to all relays
		pool.publish(event, WRITEONLY_RELAYS);

		// update state
		setCount(count + 1);
	};

	useEffect(() => {
		setCount(reposts);
	}, [reposts]);

	return (
		<button
			type="button"
			onClick={(e) => submitEvent(e)}
			className="w-20 group inline-flex items-center gap-1.5"
		>
			<RepostIcon
				width={16}
				height={16}
				className="text-zinc-400 group-hover:text-blue-400"
			/>
			<span className="text-base leading-none text-zinc-400 group-hover:text-white">
				{compactNumber.format(count)}
			</span>
		</button>
	);
}
