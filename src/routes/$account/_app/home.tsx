import { commands } from "@/commands.gen";
import type { LumeColumn } from "@/types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$account/_app/home")({
	loader: async ({ context }) => {
		const key = "lume_v4:columns";
		const defaultColumns = context.systemColumns.filter((col) => col.default);
		const query = await commands.getLumeStore(key);

		if (query.status === "ok") {
			const columns: LumeColumn[] = JSON.parse(query.data);
			return columns;
		} else {
			return defaultColumns;
		}
	},
});
