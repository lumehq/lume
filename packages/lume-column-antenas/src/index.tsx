import { Column } from "@lume/ark";
import { GroupFeedsIcon } from "@lume/icons";
import { IColumn } from "@lume/types";
import { AntenasForm } from "./components/form";
import { EventRoute } from "./event";
import { HomeRoute } from "./home";
import { UserRoute } from "./user";

export function Antenas({ column }: { column: IColumn }) {
	const colKey = `antenas-${column.id}`;
	const created = !!column.content?.length;

	return (
		<Column.Root>
			{created ? (
				<>
					<Column.Header
						id={column.id}
						title={column.title}
						icon={<GroupFeedsIcon className="size-4" />}
					/>
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
