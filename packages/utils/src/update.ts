import { check } from "@tauri-apps/plugin-updater";
import { ask, message } from "@tauri-apps/plugin-dialog";
import { relaunch } from "@tauri-apps/plugin-process";

export async function checkForAppUpdates(silent: boolean) {
	const update = await check();

	if (!update) {
		if (silent) return;

		await message("You are on the latest version. Stay awesome!", {
			title: "No Update Available",
			kind: "info",
			okLabel: "OK",
		});

		return;
	}

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
