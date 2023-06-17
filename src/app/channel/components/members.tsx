import { Member } from "@app/channel/components/member";
import { getChannelUsers } from "@libs/storage";
import useSWR from "swr";

const fetcher = ([, id]) => getChannelUsers(id);

export function ChannelMembers({ id }: { id: string }) {
	const { data, isLoading }: any = useSWR(["channel-members", id], fetcher);

	return (
		<div className="mt-3">
			<h5 className="border-b border-zinc-900 pb-1 font-semibold text-zinc-200">
				Members
			</h5>
			<div className="mt-3 w-full flex flex-wrap gap-1.5">
				{isLoading && <p>Loading...</p>}
				{!data ? (
					<p>Loading...</p>
				) : (
					data.map((member: { pubkey: string }) => (
						<Member key={member.pubkey} pubkey={member.pubkey} />
					))
				)}
			</div>
		</div>
	);
}
