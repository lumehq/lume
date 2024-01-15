import { useStorage } from "@lume/storage";
import { downloadDir } from "@tauri-apps/api/path";
import { message, save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { relaunch } from "@tauri-apps/plugin-process";
import { useRouteError } from "react-router-dom";

interface RouteError {
	statusText: string;
	message: string;
}

export function ErrorScreen() {
	const storage = useStorage();
	const error = useRouteError() as RouteError;

	const restart = async () => {
		await relaunch();
	};

	const download = async () => {
		try {
			const downloadPath = await downloadDir();
			const fileName = `nostr_keys_${new Date().toISOString()}.txt`;
			const filePath = await save({
				defaultPath: `${downloadPath}/${fileName}`,
			});
			const nsec = await storage.loadPrivkey(ark.account.pubkey);

			if (filePath) {
				if (nsec) {
					await writeTextFile(
						filePath,
						`Nostr account, generated by Lume (lume.nu)\nPublic key: ${ark.account.id}\nPrivate key: ${nsec}`,
					);
				} else {
					await writeTextFile(
						filePath,
						`Nostr account, generated by Lume (lume.nu)\nPublic key: ${ark.account.id}`,
					);
				}
			} // else { user cancel action }
		} catch (e) {
			await message(e, {
				title: "Cannot download account keys",
				type: "error",
			});
		}
	};

	return (
		<div
			data-tauri-drag-region
			className="relative flex h-screen w-screen items-center justify-center bg-blue-600 overflow-hidden rounded-t-xl"
		>
			<div className="flex w-full max-w-2xl flex-col items-start gap-8">
				<div className="flex flex-col">
					<h1 className="mb-3 text-4xl font-semibold text-blue-400">
						Sorry, an unexpected error has occurred.
					</h1>
					<h3 className="text-3xl font-semibold leading-snug text-white">
						Don&apos;t panic, your account is safe.
						<br />
						Here are what things you can do:
					</h3>
				</div>
				<div className="flex w-full flex-col gap-3">
					<div className="flex items-center justify-between rounded-xl bg-blue-700 px-3 py-4">
						<div className="text-xl font-semibold text-white">
							1. Try to close and re-open the app
						</div>
						<button
							type="button"
							onClick={() => restart()}
							className="h-9 w-28 rounded-lg bg-blue-800 px-3 font-medium text-white hover:bg-blue-900"
						>
							Restart
						</button>
					</div>
					<div className="flex items-center justify-between rounded-xl bg-blue-700 px-3 py-4">
						<div className="text-xl font-semibold text-white">
							2. Backup Nostr account
						</div>
						<button
							type="button"
							onClick={() => download()}
							className="h-9 w-28 rounded-lg bg-blue-800 px-3 font-medium text-white hover:bg-blue-900"
						>
							Download
						</button>
					</div>
					<div className="rounded-xl bg-blue-700 px-3 py-4">
						<div className="flex w-full flex-col gap-2">
							<div className="flex w-full items-center justify-between">
								<div className="text-xl font-semibold text-white">
									3. Report this issue to Lume&apos;s Devs
								</div>
								<a
									href="https://github.com/luminous-devs/lume/issues/new"
									target="_blank"
									rel="noreferrer"
									className="inline-flex h-9 w-28 items-center justify-center rounded-lg bg-blue-800 px-3 font-medium text-white hover:bg-blue-900"
								>
									Report
								</a>
							</div>
							<div className="inline-flex h-16 items-center justify-center overflow-y-auto rounded-lg border border-dashed border-red-300 bg-blue-800 px-5">
								<p className="select-text break-all text-red-400">
									{error.statusText || error.message}
								</p>
							</div>
						</div>
					</div>
					<div className="rounded-xl bg-blue-700 px-3 py-4">
						<div className="flex w-full flex-col gap-1.5">
							<div className="text-xl font-semibold text-white">
								4. Use another Nostr client
							</div>
							<div className="select-text text-lg font-medium text-blue-300">
								<p>
									While waiting for Lume&apos;s Devs to release the bug fixes,
									you always can use other Nostr clients with your account:
								</p>
								<div className="mt-2 flex flex-col gap-1 text-white">
									<a
										className="hover:!underline"
										href="https://snort.social"
										target="_blank"
										rel="noreferrer"
									>
										snort.social
									</a>
									<a
										className="hover:!underline"
										href="https://primal.net"
										target="_blank"
										rel="noreferrer"
									>
										primal.net
									</a>
									<a
										className="hover:!underline"
										href="https://nostrudel.ninja"
										target="_blank"
										rel="noreferrer"
									>
										nostrudel.ninja
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}