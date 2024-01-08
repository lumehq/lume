import { Column } from "@lume/ark";
import { UserIcon } from "@lume/icons";
import { IColumn } from "@lume/types";
import { HomeRoute } from "./home";
import { EventRoute, UserRoute } from "@lume/ui";

export function User({ column }: { column: IColumn }) {
	return (
		<Column.Root>
			<Column.Header
				id={column.id}
				title={column.title}
				icon={<UserIcon className="size-4" />}
			/>
			<Column.Content>
				<Column.Route path="/" element={<HomeRoute id={column.content} />} />
				<Column.Route path="/events/:id" element={<EventRoute />} />
				<Column.Route path="/users/:id" element={<UserRoute />} />
			</Column.Content>
		</Column.Root>
	);
}
