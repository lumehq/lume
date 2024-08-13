import { displayNsec } from "@/commons";
import { Spinner } from "@/components";
import { CheckIcon } from "@/components";
import * as Checkbox from "@radix-ui/react-checkbox";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { message } from "@tauri-apps/plugin-dialog";
import { useState } from "react";

export const Route = createFileRoute("/$account/backup")({
	component: Screen,
});

function Screen() {
	const { account } = Route.useParams();
	const navigate = useNavigate();

	const [key, setKey] = useState(null);
	const [passphase, setPassphase] = useState("");
	const [copied, setCopied] = useState(false);
	const [loading, setLoading] = useState(false);
	const [confirm, setConfirm] = useState({ c1: false, c2: false });

	const submit = async () => {
		try {
			if (key) {
				if (!confirm.c1 || !confirm.c2) {
					return await message("You need to confirm before continue", {
						title: "Backup",
						kind: "info",
					});
				}

				navigate({ to: "/", replace: true });
			}

			// start loading
			setLoading(true);

			invoke("get_encrypted_key", {
				npub: account,
				password: passphase,
			}).then((encrypted: string) => {
				// update state
				setKey(encrypted);
				setLoading(false);
			});
		} catch (e) {
			setLoading(false);
			await message(String(e), {
				title: "Backup",
				kind: "error",
			});
		}
	};

	const copyKey = async () => {
		try {
			await writeText(key);
			setCopied(true);
		} catch (e) {
			await message(String(e), {
				title: "Backup",
				kind: "error",
			});
		}
	};

	return (
		<div className="flex flex-col items-center justify-center w-full h-full gap-6 px-5 mx-auto xl:max-w-xl">
			<div className="flex flex-col text-center">
				<h3 className="text-xl font-semibold">Backup your sign in keys</h3>
				<p className="text-neutral-700 dark:text-neutral-300">
					It's use for login to Lume or other Nostr clients. You will lost
					access to your account if you lose this key.
				</p>
			</div>
			<div className="flex flex-col w-full gap-5">
				<div className="flex flex-col gap-2">
					<label htmlFor="passphase" className="font-medium">
						Set a passphase to secure your key
					</label>
					<div className="relative">
						<input
							name="passphase"
							type="password"
							value={passphase}
							onChange={(e) => setPassphase(e.target.value)}
							className="w-full px-3 border-transparent rounded-lg h-11 bg-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:ring-0 dark:bg-white/10 dark:placeholder:text-neutral-400"
						/>
					</div>
				</div>
				{key ? (
					<>
						<div className="flex flex-col gap-2">
							<label htmlFor="nsec" className="font-medium">
								Copy this key and keep it in safe place
							</label>
							<div className="flex items-center gap-2">
								<input
									name="nsec"
									type="text"
									value={displayNsec(key, 36)}
									readOnly
									className="w-full px-3 border-transparent rounded-lg h-11 bg-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:ring-0 dark:bg-white/10 dark:placeholder:text-neutral-400"
								/>
								<button
									type="button"
									onClick={() => copyKey()}
									className="inline-flex items-center justify-center w-24 rounded-lg h-11 bg-neutral-200 hover:bg-neutral-300 dark:bg-white/20 dark:hover:bg-white/30"
								>
									{copied ? "Copied" : "Copy"}
								</button>
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<div className="font-medium">Before you continue:</div>
							<div className="flex flex-col gap-2">
								<div className="flex items-center gap-2">
									<Checkbox.Root
										checked={confirm.c1}
										onCheckedChange={() =>
											setConfirm((state) => ({ ...state, c1: !state.c1 }))
										}
										className="flex items-center justify-center rounded-md outline-none appearance-none size-6 bg-neutral-100 dark:bg-white/10 dark:hover:bg-white/20"
										id="confirm1"
									>
										<Checkbox.Indicator className="text-blue-500">
											<CheckIcon className="size-4" />
										</Checkbox.Indicator>
									</Checkbox.Root>
									<label
										className="text-sm leading-none text-neutral-800 dark:text-neutral-200"
										htmlFor="confirm1"
									>
										I will make sure keep it safe and not sharing with anyone.
									</label>
								</div>
								<div className="flex items-center gap-2">
									<Checkbox.Root
										checked={confirm.c2}
										onCheckedChange={() =>
											setConfirm((state) => ({ ...state, c2: !state.c2 }))
										}
										className="flex items-center justify-center rounded-md outline-none appearance-none size-6 bg-neutral-100 dark:bg-white/10 dark:hover:bg-white/20"
										id="confirm2"
									>
										<Checkbox.Indicator className="text-blue-500">
											<CheckIcon className="size-4" />
										</Checkbox.Indicator>
									</Checkbox.Root>
									<label
										className="text-sm leading-none text-neutral-800 dark:text-neutral-200"
										htmlFor="confirm2"
									>
										I understand I cannot recover private key.
									</label>
								</div>
							</div>
						</div>
					</>
				) : null}
				<div>
					<button
						type="button"
						onClick={() => submit()}
						disabled={loading}
						className="inline-flex items-center justify-center w-full font-semibold text-white bg-blue-500 rounded-lg h-11 shrink-0 hover:bg-blue-600 disabled:opacity-50"
					>
						{loading ? <Spinner /> : "Continue"}
					</button>
				</div>
			</div>
		</div>
	);
}
