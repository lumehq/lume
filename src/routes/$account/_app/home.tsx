import { commands } from "@/commands.gen";
import type { LumeColumn } from "@/types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$account/_app/home")({
	beforeLoad: async ({ context }) => {
		const key = "lume_v4:columns";
		const defaultColumns = context.systemColumns.filter((col) => col.default);
		const query = await commands.getLumeStore(key);

		let initialColumns: LumeColumn[] = defaultColumns;

		if (query.status === "ok") {
			initialColumns = JSON.parse(query.data);
			return { initialColumns };
		}

		return { initialColumns };
	},
});
