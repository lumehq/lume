import { Column } from "@lume/ark";
import { IColumn } from "@lume/types";
import { EventRoute, UserRoute } from "@lume/ui";
import { AntenasForm } from "./components/form";
import { HomeRoute } from "./home";

export function Antenas({ column }: { column: IColumn }) {
	const colKey = `antenas-${column.id}`;
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
				<AntenasForm id={column.id} />
			)}
		</Column.Root>
	);
}
