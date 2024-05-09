import { CheckIcon } from "@lume/icons";
import type { AppRouteSearch } from "@lume/types";
import { Spinner } from "@lume/ui";
import { displayNsec } from "@lume/utils";
import * as Checkbox from "@radix-ui/react-checkbox";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/new/backup")({
	validateSearch: (search: Record<string, string>): AppRouteSearch => {
		return {
			account: search.account,
		};
	},
	component: Screen,
});

function Screen() {
	const { account } = Route.useSearch();
	const { t } = useTranslation();

	const [key, setKey] = useState(null);
	const [passphase, setPassphase] = useState("");
	const [copied, setCopied] = useState(false);
	const [loading, setLoading] = useState(false);
	const [confirm, setConfirm] = useState({ c1: false, c2: false, c3: false });

	const navigate = useNavigate();

	const submit = async () => {
		try {
			if (key) {
				if (!confirm.c1 || !confirm.c2 || !confirm.c3) {
					return toast.warning("You need to confirm before continue");
				}

				return navigate({
					to: "/auth/settings",
					search: { account },
				});
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
			toast.error(String(e));
		}
	};

	const copyKey = async () => {
		try {
			await writeText(key);
			setCopied(true);
		} catch (e) {
			toast.error(e);
		}
	};

	return (
		<div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-6 px-5 xl:max-w-xl">
			<div className="flex flex-col text-center">
				<h3 className="text-xl font-semibold">Backup your sign in keys</h3>
				<p className="text-neutral-700 dark:text-neutral-300">
					It's use for login to Lume or other Nostr clients. You will lost
					access to your account if you lose this key.
				</p>
			</div>
			<div className="flex w-full flex-col gap-5">
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
							className="w-full h-11 rounded-lg border-transparent bg-neutral-100 px-3 placeholder:text-neutral-600 focus:border-blue-500 focus:ring-0 dark:bg-white/10 dark:placeholder:text-neutral-400"
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
									className="w-full h-11 rounded-lg border-transparent bg-neutral-100 px-3 placeholder:text-neutral-600 focus:border-blue-500 focus:ring-0 dark:bg-white/10 dark:placeholder:text-neutral-400"
								/>
								<button
									type="button"
									onClick={() => copyKey()}
									className="inline-flex h-11 w-24 items-center justify-center rounded-lg bg-neutral-200 hover:bg-neutral-300 dark:bg-white/20 dark:hover:bg-white/30"
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
										className="flex size-6 appearance-none items-center justify-center rounded-md bg-neutral-100 outline-none dark:bg-white/10 dark:hover:bg-white/20"
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
										{t("backup.confirm1")}
									</label>
								</div>
								<div className="flex items-center gap-2">
									<Checkbox.Root
										checked={confirm.c2}
										onCheckedChange={() =>
											setConfirm((state) => ({ ...state, c2: !state.c2 }))
										}
										className="flex size-6 appearance-none items-center justify-center rounded-md bg-neutral-100 outline-none dark:bg-white/10 dark:hover:bg-white/20"
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
										{t("backup.confirm2")}
									</label>
								</div>
								<div className="flex items-center gap-2">
									<Checkbox.Root
										checked={confirm.c3}
										onCheckedChange={() =>
											setConfirm((state) => ({ ...state, c3: !state.c3 }))
										}
										className="flex size-6 appearance-none items-center justify-center rounded-md bg-neutral-100 outline-none dark:bg-white/10 dark:hover:bg-white/20"
										id="confirm3"
									>
										<Checkbox.Indicator className="text-blue-500">
											<CheckIcon className="size-4" />
										</Checkbox.Indicator>
									</Checkbox.Root>
									<label
										className="text-sm leading-none text-neutral-800 dark:text-neutral-200"
										htmlFor="confirm3"
									>
										{t("backup.confirm3")}
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
						className="inline-flex h-11 w-full shrink-0  items-center justify-center rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
					>
						{loading ? <Spinner /> : t("global.continue")}
					</button>
				</div>
			</div>
		</div>
	);
}
