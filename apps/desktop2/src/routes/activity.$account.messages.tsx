import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/activity/$account/messages")({
	component: () => <div>Hello /activity/$account/messages!</div>,
});
