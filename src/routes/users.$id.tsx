import { NostrQuery } from "@/system";
import { createFileRoute, defer } from "@tanstack/react-router";

export const Route = createFileRoute("/users/$id")({
	beforeLoad: async () => {
		const settings = await NostrQuery.getUserSettings();
		return { settings };
	},
	loader: async ({ params }) => {
		return { data: defer(NostrQuery.getUserEvents(params.id)) };
	},
});
