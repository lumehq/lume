import { commands } from "@/commands.gen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/columns/_layout/stories")({
	beforeLoad: async () => {
		const res = await commands.getContactList();

		if (res.status === "ok") {
			const contacts = res.data;
			return { contacts };
		} else {
			throw new Error(res.error);
		}
	},
});
