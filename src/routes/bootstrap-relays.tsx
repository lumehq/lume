import { commands } from "@/commands.gen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bootstrap-relays")({
	loader: async () => {
		const res = await commands.getBootstrapRelays();

		if (res.status === "ok") {
			return res.data.map((item) => item.replace(",", ""));
		} else {
			throw new Error(res.error);
		}
	},
});
