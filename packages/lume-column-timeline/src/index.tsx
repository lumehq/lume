import { Column, useArk } from "@lume/ark";
import { TimelineIcon } from "@lume/icons";
import { IColumn } from "@lume/types";
import { EventRoute, SuggestRoute, UserRoute } from "@lume/ui";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { HomeRoute } from "./home";

export function Timeline({ column }: { column: IColumn }) {
	const colKey = `timeline-${column.id}`;
	const ark = useArk();
	const queryClient = useQueryClient();
	const since = useRef(Math.floor(Date.now() / 1000));

	const refresh = async (events: NDKEvent[]) => {
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
			{ark.account.contacts.length ? (
				<Column.Live
					filter={{
						kinds: [NDKKind.Text, NDKKind.Repost],
						authors: ark.account.contacts,
						since: since.current,
					}}
					onClick={refresh}
				/>
			) : null}
			<Column.Content>
				<Column.Route path="/" element={<HomeRoute colKey={colKey} />} />
				<Column.Route path="/events/:id" element={<EventRoute />} />
				<Column.Route path="/users/:id" element={<UserRoute />} />
				<Column.Route
					path="/suggest"
					element={<SuggestRoute queryKey={[colKey]} />}
				/>
			</Column.Content>
		</Column.Root>
	);
}
