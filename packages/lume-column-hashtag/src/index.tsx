import { Column } from "@lume/ark";
import { HashtagIcon } from "@lume/icons";
import { IColumn } from "@lume/types";
import { HomeRoute } from "./home";
import { EventRoute, UserRoute } from "@lume/ui";

export function Hashtag({ column }: { column: IColumn }) {
	const colKey = `hashtag-${column.id}`;
	const hashtag = column.content.replace("#", "");

	return (
		<Column.Root>
			<Column.Header
				id={column.id}
				queryKey={[colKey]}
				title={hashtag}
				icon={<HashtagIcon className="size-4" />}
			/>
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
