import { commands } from "@/commands.gen";
import type { NostrEvent } from "@/types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/columns/_layout/interests/$id")({
	loader: async ({ params }) => {
		const res = await commands.getInterest(params.id);

		if (res.status === "ok") {
			const event: NostrEvent = JSON.parse(res.data);
			const tag = event.tags
				.filter((tag) => tag[0] === "t")
				.map((tag) => tag[1]);

			return tag;
		} else {
			throw new Error(res.error);
		}
	},
});
