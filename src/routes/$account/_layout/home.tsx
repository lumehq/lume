import { NostrQuery } from "@/system";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$account/_layout/home")({
	loader: async () => {
		const columns = await NostrQuery.getColumns();
		return columns;
	},
});
