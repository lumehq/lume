import { Column } from "@lume/ark";
import { WidgetProps } from "@lume/types";
import { EventRoute } from "./event";
import { HomeRoute } from "./home";
import { UserRoute } from "./user";

export function Thread({ thread }: { thread: WidgetProps }) {
	return (
		<Column.Root>
			<Column.Header id={thread.id} title={thread.title} />
			<Column.Content>
				<Column.Route path="/" element={<HomeRoute id={thread.content} />} />
				<Column.Route path="/events/:id" element={<EventRoute />} />
				<Column.Route path="/users/:id" element={<UserRoute />} />
			</Column.Content>
		</Column.Root>
	);
}
