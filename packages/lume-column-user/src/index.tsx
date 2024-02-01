import { Column } from "@lume/ark";
import { IColumn } from "@lume/types";
import { EventRoute, UserRoute } from "@lume/ui";
import { HomeRoute } from "./home";

export function User({ column }: { column: IColumn }) {
	return (
		<Column.Root>
			<Column.Header id={column.id} title={column.title} />
			<Column.Content>
				<Column.Route path="/" element={<HomeRoute id={column.content} />} />
				<Column.Route path="/events/:id" element={<EventRoute />} />
				<Column.Route path="/users/:id" element={<UserRoute />} />
			</Column.Content>
		</Column.Root>
	);
}
