import { NostrQuery } from "@/system";
import type { LumeColumn } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { resolveResource } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/plugin-fs";

export const Route = createFileRoute("/$account/_layout")({
	beforeLoad: async () => {
		const settings = await NostrQuery.getUserSettings();
		const systemPath = "resources/columns.json";
		const resourcePath = await resolveResource(systemPath);
		const resourceFile = await readTextFile(resourcePath);
		const systemColumns: LumeColumn[] = JSON.parse(resourceFile);

		return { systemColumns, settings };
	},
});
