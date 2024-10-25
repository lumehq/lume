import type { LumeColumn } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { nanoid } from "nanoid";

export const Route = createFileRoute("/_app/")({
	loader: async ({ context }) => {
		const accounts = context.accounts;
		const prevColumns = window.localStorage.getItem("columns");

		let initialAppColumns: LumeColumn[] = [];

		if (!prevColumns || prevColumns.length < 1) {
			initialAppColumns.push({
				label: "onboarding",
				name: "Onboarding",
				url: "/columns/onboarding",
			});

			for (const account of accounts) {
				initialAppColumns.push({
					label: `launchpad-${nanoid()}`,
					name: "Launchpad",
					url: `/columns/launchpad/${account}`,
					account,
				});
			}
		} else {
			const parsed: LumeColumn[] = JSON.parse(prevColumns);

			initialAppColumns = parsed.filter((item) =>
				item.account ? context.accounts.includes(item.account) : item,
			);
		}

		return initialAppColumns;
	},
});
