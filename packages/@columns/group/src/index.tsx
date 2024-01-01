import { Column } from "@lume/ark";
import { GroupFeedsIcon } from "@lume/icons";
import { IColumn } from "@lume/types";
import { GroupForm } from "./components/form";
import { HomeRoute } from "./home";

export function Group({ column }: { column: IColumn }) {
	const colKey = `group-${column.id}`;
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
					</Column.Content>
				</>
			) : (
				<GroupForm id={column.id} />
			)}
		</Column.Root>
	);
}
