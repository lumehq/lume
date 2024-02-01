import { Column } from "@lume/ark";
import { IColumn } from "@lume/types";
import { EventRoute, UserRoute } from "@lume/ui";
import { HomeRoute } from "./home";

export function TrendingNotes({ column }: { column: IColumn }) {
	const colKey = `trending-notes-${column.id}`;

	return (
		<Column.Root>
			<Column.Header
				id={column.id}
				queryKey={[colKey]}
				title="Trending Notes"
			/>
			<Column.Content>
				<Column.Route path="/" element={<HomeRoute colKey={colKey} />} />
				<Column.Route path="/events/:id" element={<EventRoute />} />
				<Column.Route path="/users/:id" element={<UserRoute />} />
			</Column.Content>
		</Column.Root>
	);
}
