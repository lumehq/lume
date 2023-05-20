import { useChannelProfile } from "@app/channel/hooks/useChannelProfile";

import { usePageContext } from "@utils/hooks/usePageContext";

import { twMerge } from "tailwind-merge";

export default function ChannelsListItem({ data }: { data: any }) {
	const channel: any = useChannelProfile(data.event_id, data.pubkey);
	const pageContext = usePageContext();

	const searchParams: any = pageContext.urlParsed.search;
	const pageID = searchParams.id;

	return (
		<a
			href={`/app/channel?id=${data.event_id}&channelpub=${data.pubkey}`}
			className={twMerge(
				"group inline-flex h-8 items-center gap-2.5 rounded-md px-2.5 hover:bg-zinc-900",
				pageID === data.event_id
					? "dark:bg-zinc-900 dark:text-white hover:dark:bg-zinc-800"
					: "",
			)}
		>
			<div
				className={twMerge(
					"inline-flex h-5 w-5 items-center justify-center rounded bg-zinc-900 group-hover:bg-zinc-800",
					pageID === data.event_id
						? "dark:bg-zinc-800 group-hover:dark:bg-zinc-700"
						: "",
				)}
			>
				<span className="text-base text-white">#</span>
			</div>
			<div>
				<h5 className="truncate font-medium text-zinc-400">{channel?.name}</h5>
			</div>
		</a>
	);
}
