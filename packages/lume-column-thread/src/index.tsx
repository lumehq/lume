import { Column } from "@lume/ark";
import { LumeColumn } from "@lume/types";
import { HomeRoute } from "./home";
import { EventRoute, UserRoute } from "@lume/ui";

export function Thread({ column }: { column: LumeColumn }) {
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
