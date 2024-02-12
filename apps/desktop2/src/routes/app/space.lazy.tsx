import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/space")({
	component: Space,
});

function Space() {
	return (
		<div className="h-full w-full rounded-xl overflow-hidden bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:bg-black dark:shadow-none dark:ring-1 dark:ring-white/5">
			<p>Hello</p>
		</div>
	);
}
