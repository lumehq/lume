import { Frame, Spinner } from "@/components";
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
				// @ts-ignore, this is tanstack router bug
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
			<Frame
				className="p-6 h-36 flex flex-col gap-2 items-center justify-center text-center rounded-xl overflow-hidden"
				shadow
			>
				<Spinner />
				<p className="text-sm text-neutral-600 dark:text-neutral-40">
					Fetching necessary data for the first time login...
				</p>
			</Frame>
		</div>
	);
}
