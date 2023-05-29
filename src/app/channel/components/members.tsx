import { Member } from "@app/channel/components/member";
import { useChannelMessages } from "@stores/channels";
import { useEffect } from "react";

export function ChannelMembers() {
	return (
		<div className="flex flex-wrap gap-1">
			{[].map((member) => (
				<Member key={member} pubkey={member} />
			))}
		</div>
	);
}
