import type { LumeColumn } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { resolveResource } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/plugin-fs";

export const Route = createFileRoute("/columns/_layout/gallery")({
	beforeLoad: async () => {
		const systemPath = "resources/columns.json";
		const resourcePath = await resolveResource(systemPath);
		const resourceFile = await readTextFile(resourcePath);

		const systemColumns: LumeColumn[] = JSON.parse(resourceFile);
		const columns = systemColumns.filter((col) => !col.default);

		return {
			columns,
		};
	},
});
