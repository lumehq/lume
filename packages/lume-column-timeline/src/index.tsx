import { Column } from "@lume/ark";
import { LumeColumn } from "@lume/types";
import { EventRoute, SuggestRoute, UserRoute } from "@lume/ui";
import { HomeRoute } from "./home";

export function Timeline({ column }: { column: LumeColumn }) {
	const colKey = `timeline-${column.id}`;

	return (
		<Column.Provider column={column}>
			<Column.Root>
				<Column.Header queryKey={[colKey]} />
				<Column.Content>
					<Column.Route path="/" element={<HomeRoute queryKey={colKey} />} />
					<Column.Route path="/events/:id" element={<EventRoute />} />
					<Column.Route path="/users/:id" element={<UserRoute />} />
					<Column.Route
						path="/suggest"
						element={<SuggestRoute queryKey={colKey} />}
					/>
				</Column.Content>
			</Column.Root>
		</Column.Provider>
	);
}
