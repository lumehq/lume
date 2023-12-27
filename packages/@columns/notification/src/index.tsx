import { Column } from "@lume/ark";
import { BellIcon } from "@lume/icons";
import { HomeRoute } from "./home";

export function Notification() {
	const colKey = "notification";

	return (
		<Column.Root>
			<Column.Header
				id="9999"
				queryKey={[colKey]}
				title="Notifications"
				icon={<BellIcon className="size-4" />}
			/>
			<Column.Content>
				<Column.Route path="/" element={<HomeRoute colKey={colKey} />} />
			</Column.Content>
		</Column.Root>
	);
}
