import { commands } from "@/commands.gen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$id/set-group")({
	loader: async ({ params }) => {
		const res = await commands.getContactList(params.id);

		if (res.status === "ok") {
			return res.data;
		} else {
			throw new Error(res.error);
		}
	},
});
