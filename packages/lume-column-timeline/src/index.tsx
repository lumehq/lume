import { Column, useArk } from "@lume/ark";
import { TimelineIcon } from "@lume/icons";
import { IColumn } from "@lume/types";
import { EventRoute, UserRoute } from "@lume/ui";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { HomeRoute } from "./home";

export function Timeline({ column }: { column: IColumn }) {
	const colKey = `timeline-${column.id}`;
	const ark = useArk();
	const queryClient = useQueryClient();
	const since = useRef(Math.floor(Date.now() / 1000));

	const refreshTimeline = async (events: NDKEvent[]) => {
		const uniqEvents = new Set(events);
		await queryClient.setQueryData(
			[colKey],
			(prev: { pageParams: number; pages: Array<NDKEvent[]> }) => ({
				...prev,
				pages: [[...uniqEvents], ...prev.pages],
			}),
		);
	};

	return (
		<Column.Root>
			<Column.Header
				id={column.id}
				queryKey={[colKey]}
				title="Timeline"
				icon={<TimelineIcon className="size-4" />}
			/>
			<Column.Live
				filter={{
					kinds: [NDKKind.Text, NDKKind.Repost],
					authors: !ark.account.contacts.length
						? [ark.account.pubkey]
						: ark.account.contacts,
					since: since.current,
				}}
				onClick={refreshTimeline}
			/>
			<Column.Content>
				<Column.Route path="/" element={<HomeRoute colKey={colKey} />} />
				<Column.Route path="/events/:id" element={<EventRoute />} />
				<Column.Route path="/users/:id" element={<UserRoute />} />
			</Column.Content>
		</Column.Root>
	);
}
