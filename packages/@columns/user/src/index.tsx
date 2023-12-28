import { Column } from "@lume/ark";
import { UserIcon } from "@lume/icons";
import { WidgetProps } from "@lume/types";
import { EventRoute } from "./event";
import { HomeRoute } from "./home";
import { UserRoute } from "./user";

export function User({ user }: { user: WidgetProps }) {
	return (
		<Column.Root>
			<Column.Header
				id={user.id}
				title={user.title}
				icon={<UserIcon className="size-4" />}
			/>
			<Column.Content>
				<Column.Route path="/" element={<HomeRoute id={user.content} />} />
				<Column.Route path="/events/:id" element={<EventRoute />} />
				<Column.Route path="/users/:id" element={<UserRoute />} />
			</Column.Content>
		</Column.Root>
	);
}
