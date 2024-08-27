import { commands } from "@/commands.gen";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/columns/_layout/group")({
	beforeLoad: async ({ search }) => {
		const key = `lume_v4:group:${search.label}`;
		const res = await commands.getLumeStore(key);

		if (res.status === "ok") {
			const groups: string[] = JSON.parse(res.data);

			if (groups.length) {
				return { groups };
			}
		}

		throw redirect({
			to: "/columns/create-group",
			search: {
				...search,
				redirect: "/columns/group",
			},
		});
	},
});
