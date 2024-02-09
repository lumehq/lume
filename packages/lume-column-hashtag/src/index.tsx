import { Column } from "@lume/ark";
import { LumeColumn } from "@lume/types";
import { EventRoute, UserRoute } from "@lume/ui";
import { HomeRoute } from "./home";

export function Hashtag({ column }: { column: LumeColumn }) {
	const colKey = `hashtag-${column.id}`;
	const hashtag = column.content.replace("#", "");

	return (
		<Column.Root>
			<Column.Header id={column.id} queryKey={[colKey]} title={hashtag} />
			<Column.Content>
				<Column.Route
					path="/"
					element={<HomeRoute colKey={colKey} hashtag={hashtag} />}
				/>
				<Column.Route path="/events/:id" element={<EventRoute />} />
				<Column.Route path="/users/:id" element={<UserRoute />} />
			</Column.Content>
		</Column.Root>
	);
}
