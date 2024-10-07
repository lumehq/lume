import { createFileRoute } from "@tanstack/react-router";

type RouteSearch = {
	account: string;
};

export const Route = createFileRoute("/set-interest")({
	validateSearch: (search: Record<string, string>): RouteSearch => {
		return {
			account: search.account,
		};
	},
});
