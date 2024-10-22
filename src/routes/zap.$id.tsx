import { commands } from "@/commands.gen";
import { LumeEvent } from "@/system";
import type { NostrEvent } from "@/types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/zap/$id")({
	beforeLoad: async ({ params }) => {
		const accounts = await commands.getAccounts();
		const res = await commands.getEvent(params.id);

		if (res.status === "ok") {
			const data = res.data;
			const raw: NostrEvent = JSON.parse(data.raw);

			if (data.parsed) {
				raw.meta = data.parsed;
			}

			return { accounts, event: new LumeEvent(raw) };
		} else {
			throw new Error(res.error);
		}
	},
});
