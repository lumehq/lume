import { Column } from "@lume/ark";
import { TimelineIcon } from "@lume/icons";
import { EventRoute } from "./event";
import { HomeRoute } from "./home";
import { UserRoute } from "./user";

export function Timeline() {
	return (
		<Column.Root>
			<Column.Header
				id="9999"
				queryKey={["newsfeed"]}
				title="Timeline"
				icon={<TimelineIcon className="size-4" />}
			/>
			<Column.Content>
				<Column.Route path="/" element={<HomeRoute />} />
				<Column.Route path="/events/:id" element={<EventRoute />} />
				<Column.Route path="/users/:id" element={<UserRoute />} />
			</Column.Content>
		</Column.Root>
	);
}
