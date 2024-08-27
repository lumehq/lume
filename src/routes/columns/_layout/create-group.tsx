import { NostrAccount } from "@/system";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/columns/_layout/create-group")({
	loader: async () => {
		const contacts = await NostrAccount.getContactList();
		return contacts;
	},
});
