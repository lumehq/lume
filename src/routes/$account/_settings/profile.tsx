import { commands } from "@/commands.gen";
import type { Metadata } from "@/types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$account/_settings/profile")({
	beforeLoad: async ({ params }) => {
		const res = await commands.getProfile(params.account);

		if (res.status === "ok") {
			const profile: Metadata = JSON.parse(res.data);
			return { profile };
		} else {
			throw new Error(res.error);
		}
	},
});
