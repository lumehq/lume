import { createFileRoute } from "@tanstack/react-router";

export interface RouteSearch {
	account?: string;
}

export const Route = createFileRoute("/set-signer")({
	validateSearch: (search: Record<string, string>): RouteSearch => {
		return {
			account: search.account,
		};
	},
});
