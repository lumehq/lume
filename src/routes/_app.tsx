import { commands } from "@/commands.gen";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { ask } from "@tauri-apps/plugin-dialog";
import { relaunch } from "@tauri-apps/plugin-process";
import { check } from "@tauri-apps/plugin-updater";

async function checkForAppUpdates() {
	const update = await check();

	if (update?.available) {
		const yes = await ask(
			`Update to ${update.version} is available!\n\nRelease notes: ${update.body}`,
			{
				title: "Update Available",
				kind: "info",
				okLabel: "Update",
				cancelLabel: "Cancel",
			},
		);

		if (yes) {
			await update.downloadAndInstall();
			await relaunch();
		}

		return;
	}
}

export const Route = createFileRoute("/_app")({
	beforeLoad: async () => {
		await checkForAppUpdates();
		const accounts = await commands.getAccounts();

		if (!accounts.length) {
			throw redirect({ to: "/new", replace: true });
		}

		return { accounts };
	},
});
