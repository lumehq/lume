import { commands } from "@/commands.gen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/relays")({
	beforeLoad: async () => {
		const res = await commands.getAllRelays();

		if (res.status === "ok") {
			return { allRelays: res.data };
		} else {
			throw new Error(res.error);
		}
	},
});
