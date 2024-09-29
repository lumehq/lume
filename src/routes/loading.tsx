import { Spinner } from "@/components";
import { createFileRoute } from "@tanstack/react-router";
import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";

type RouteSearch = {
	account: string;
};

export const Route = createFileRoute("/loading")({
	validateSearch: (search: Record<string, string>): RouteSearch => {
		return {
			account: search.account,
		};
	},
	component: Screen,
});

function Screen() {
	const navigate = Route.useNavigate();
	const search = Route.useSearch();

	useEffect(() => {
		const unlisten = listen("synchronized", () => {
			navigate({
				to: "/$account/home",
				params: { account: search.account },
				replace: true,
			});
		});

		return () => {
			unlisten.then((f) => f());
		};
	}, []);

	return (
		<div className="size-full flex items-center justify-center">
			<div className="flex flex-col gap-2 items-center justify-center text-center">
				<Spinner />
				<p className="text-sm">
					Fetching necessary data for the first time login...
				</p>
			</div>
		</div>
	);
}
