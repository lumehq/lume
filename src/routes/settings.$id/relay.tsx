import { commands } from "@/commands.gen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/$id/relay")({
	beforeLoad: async ({ params }) => {
		const res = await commands.getRelays(params.id);

		if (res.status === "ok") {
			return { relayList: res.data };
		} else {
			throw new Error(res.error);
		}
	},
});
