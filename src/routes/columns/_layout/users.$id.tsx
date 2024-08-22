import { NostrQuery } from "@/system";
import { createFileRoute, defer } from "@tanstack/react-router";

export const Route = createFileRoute("/columns/_layout/users/$id")({
	loader: async ({ params }) => {
		return { data: defer(NostrQuery.getUserEvents(params.id)) };
	},
});
