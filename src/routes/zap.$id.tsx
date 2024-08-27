import { NostrQuery } from "@/system";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/zap/$id")({
	beforeLoad: async ({ params }) => {
		const event = await NostrQuery.getEvent(params.id);
		return { event };
	},
});
