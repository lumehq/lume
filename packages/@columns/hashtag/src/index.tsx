import { Column } from "@lume/ark";
import { HashtagIcon, TimelineIcon } from "@lume/icons";
import { IColumn } from "@lume/types";
import { EventRoute } from "./event";
import { HomeRoute } from "./home";
import { UserRoute } from "./user";

export function Hashtag({ column }: { column: IColumn }) {
	const colKey = "hashtag";
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
