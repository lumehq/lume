import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/panel")({
	component: Screen,
});

function Screen() {
	return (
		<div className="w-full h-full flex items-center justify-center">Hello!</div>
	);
}
