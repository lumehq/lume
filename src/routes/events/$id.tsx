import { NostrQuery } from "@/system";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/events/$id")({
	beforeLoad: async () => {
		const settings = await NostrQuery.getUserSettings();
		return { settings };
	},
	loader: async ({ params }) => {
		const event = await NostrQuery.getEvent(params.id);
		return event;
	},
});
