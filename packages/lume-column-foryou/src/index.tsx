import { Column } from "@lume/ark";
import { ForyouIcon } from "@lume/icons";
import { useStorage } from "@lume/storage";
import { IColumn } from "@lume/types";
import { EventRoute, UserRoute } from "@lume/ui";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { HomeRoute } from "./home";

export function ForYou({ column }: { column: IColumn }) {
	const colKey = `foryou-${column.id}`;
	const storage = useStorage();
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
				title="For You"
				icon={<ForyouIcon className="size-4" />}
			/>
			{storage.interests?.hashtags ? (
				<Column.Live
					filter={{
						kinds: [NDKKind.Text],
						"#t": storage.interests.hashtags.map((item: string) =>
							item.replace("#", "").toLowerCase(),
						),
						since: since.current,
					}}
					onClick={refresh}
				/>
			) : null}
			<Column.Content>
				<Column.Route path="/" element={<HomeRoute colKey={colKey} />} />
				<Column.Route path="/events/:id" element={<EventRoute />} />
				<Column.Route path="/users/:id" element={<UserRoute />} />
			</Column.Content>
		</Column.Root>
	);
}
