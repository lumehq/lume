import { NostrQuery } from "@/system";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/columns/_layout/group")({
	beforeLoad: async ({ search }) => {
		const key = `lume_v4:group:${search.label}`;
		const groups: string[] = await NostrQuery.getNstore(key);

		if (!groups?.length) {
			throw redirect({
				to: "/columns/create-group",
				search: {
					...search,
					redirect: "/group",
				},
			});
		}

		return { groups };
	},
});
