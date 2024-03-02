import { Column } from "@lume/ark";
import { LumeColumn } from "@lume/types";
import { EventRoute, UserRoute } from "@lume/ui";
import { GroupForm } from "./components/form";
import { HomeRoute } from "./home";

export function Group({ column }: { column: LumeColumn }) {
	const colKey = `group-${column.id}`;
	const created = !!column.content?.length;

	return (
		<Column.Root>
			{created ? (
				<>
					<Column.Header id={column.id} title={column.title} />
					<Column.Content>
						<Column.Route
							path="/"
							element={<HomeRoute colKey={colKey} content={column.content} />}
						/>
						<Column.Route path="/events/:id" element={<EventRoute />} />
						<Column.Route path="/users/:id" element={<UserRoute />} />
					</Column.Content>
				</>
			) : (
				<GroupForm id={column.id} />
			)}
		</Column.Root>
	);
}
