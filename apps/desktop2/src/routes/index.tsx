import { createFileRoute, redirect } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";

export const Route = createFileRoute("/")({
	component: Index,
	beforeLoad: async ({ location }) => {
		const signer = await invoke("verify_signer");
		if (!signer) {
			throw redirect({
				to: "/landing",
				search: {
					redirect: location.href,
				},
			});
		}
	},
});

function Index() {
	return (
		<div className="p-2">
			<h3>Welcome Home!</h3>
		</div>
	);
}
