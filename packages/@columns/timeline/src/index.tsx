import { Column, useStorage } from "@lume/ark";
import { TimelineIcon } from "@lume/icons";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { EventRoute } from "./event";
import { HomeRoute } from "./home";
import { UserRoute } from "./user";

export function Timeline() {
	const colKey = "newsfeed";
	const storage = useStorage();
	const queryClient = useQueryClient();
	const since = useRef(Math.floor(Date.now() / 1000));

	const refreshTimeline = async (events: NDKEvent[]) => {
		await queryClient.setQueryData(
			[colKey],
			(prev: { pageParams: number; pages: Array<NDKEvent[]> }) => ({
				...prev,
				pages: [[...events], ...prev.pages],
			}),
		);
	};

	return (
		<Column.Root>
			<Column.Header
				id="9999"
				queryKey={[colKey]}
				title="Timeline"
				icon={<TimelineIcon className="size-4" />}
			/>
			<Column.Live
				filter={{
					kinds: [NDKKind.Text, NDKKind.Repost],
					authors: !storage.account.contacts.length
						? [storage.account.pubkey]
						: storage.account.contacts,
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
