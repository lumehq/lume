import { createFileRoute, redirect } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";

export const Route = createFileRoute("/")({
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
		throw redirect({
			to: "/app/space",
		});
	},
});
