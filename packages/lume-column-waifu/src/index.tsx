import { Column } from "@lume/ark";
import { LumeColumn } from "@lume/types";
import { HomeRoute } from "./home";

export function Waifu({ column }: { column: LumeColumn }) {
	const colKey = `waifu-${column.id}`;

	return (
		<Column.Root>
			<Column.Header id={column.id} title={column.title} />
			<Column.Content>
				<Column.Route path="/" element={<HomeRoute colKey={colKey} />} />
			</Column.Content>
		</Column.Root>
	);
}
