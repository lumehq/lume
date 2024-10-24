import { commands } from "@/commands.gen";
import { displayNpub } from "@/commons";
import { User } from "@/components";
import type { Metadata } from "@/types";
import { CaretDown } from "@phosphor-icons/react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Menu, MenuItem } from "@tauri-apps/api/menu";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { message } from "@tauri-apps/plugin-dialog";
import { useCallback, useEffect, useState, useTransition } from "react";
import CurrencyInput from "react-currency-input-field";

const DEFAULT_VALUES = [21, 50, 100, 200];

export const Route = createLazyFileRoute("/zap/$id")({
	component: Screen,
});

function Screen() {
	const { accounts, event } = Route.useRouteContext();

	const [currentUser, setCurrentUser] = useState<string | null>(null);
	const [amount, setAmount] = useState(21);
	const [content, setContent] = useState<string>("");
	const [isCompleted, setIsCompleted] = useState(false);
	const [isPending, startTransition] = useTransition();

	const showContextMenu = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();

		const list: Promise<MenuItem>[] = [];

		for (const account of accounts) {
			const res = await commands.getProfile(account);
			let name = "unknown";

			if (res.status === "ok") {
				const profile: Metadata = JSON.parse(res.data);
				name = profile.display_name ?? profile.name ?? "unknown";
			}

			list.push(
				MenuItem.new({
					text: `Zap as ${name} (${displayNpub(account, 16)})`,
					action: async () => setCurrentUser(account),
				}),
			);
		}

		const items = await Promise.all(list);
		const menu = await Menu.new({ items });

		await menu.popup().catch((e) => console.error(e));
	}, []);

	const zap = () => {
		startTransition(async () => {
			if (!currentUser) return;

			const signer = await commands.hasSigner(currentUser);

			if (signer.status === "ok") {
				if (!signer.data) {
					const res = await commands.setSigner(currentUser);

					if (res.status === "error") {
						await message(res.error, { kind: "error" });
						return;
					}
				}

				const res = await commands.zapEvent(
					event.id,
					amount.toString(),
					content,
				);

				if (res.status === "ok") {
					setIsCompleted(true);
					// close current window
					await getCurrentWindow().close();
				} else {
					await message(res.error, { kind: "error" });
					return;
				}
			} else {
				return;
			}
		});
	};

	useEffect(() => {
		if (accounts?.length) {
			setCurrentUser(accounts[0]);
		}
	}, [accounts]);

	return (
		<div data-tauri-drag-region className="flex flex-col pb-5 size-full">
			<div
				data-tauri-drag-region
				className="flex items-center justify-center h-32 gap-2 shrink-0"
			>
				<p className="text-sm">Send zap to </p>
				<User.Provider pubkey={event.pubkey}>
					<User.Root className="inline-flex items-center gap-2 p-1 rounded-full bg-black/5 dark:bg-white/5">
						<User.Avatar className="rounded-full size-6" />
						<User.Name className="pr-2 text-sm font-medium" />
					</User.Root>
				</User.Provider>
			</div>
			<div className="flex flex-col justify-between h-full">
				<div className="flex flex-col justify-between flex-1 px-5">
					<div className="relative flex flex-col flex-1 pb-8">
						<div className="inline-flex items-center justify-center flex-1 h-full gap-1">
							<CurrencyInput
								placeholder="0"
								defaultValue={21}
								value={amount}
								decimalsLimit={2}
								min={0} // 0 sats
								max={10000} // 1M sats
								maxLength={10000} // 1M sats
								onValueChange={(value) => setAmount(Number(value))}
								className="flex-1 w-full text-4xl font-semibold text-right bg-transparent border-none placeholder:text-neutral-600 focus:outline-none focus:ring-0 dark:text-neutral-400"
							/>
							<span className="flex-1 w-full text-4xl font-semibold text-left text-neutral-500 dark:text-neutral-400">
								sats
							</span>
						</div>
						<div className="inline-flex items-center justify-center gap-2">
							{DEFAULT_VALUES.map((value) => (
								<button
									key={value}
									type="button"
									onClick={() => setAmount(value)}
									className="w-max rounded-full bg-black/10 px-2.5 py-1 text-xs font-medium hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
								>
									{value} sats
								</button>
							))}
						</div>
					</div>
					<div className="flex flex-col w-full gap-2">
						<input
							name="message"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							spellCheck={false}
							autoComplete="off"
							autoCorrect="off"
							autoCapitalize="off"
							placeholder="Enter message (optional)"
							className="h-10 w-full resize-none rounded-lg border-transparent bg-black/5 px-3 !outline-none placeholder:text-neutral-600 focus:border-blue-500 focus:ring-0 dark:bg-white/5"
						/>
						<div className="inline-flex items-center gap-3">
							<button
								type="button"
								onClick={() => zap()}
								className="inline-flex items-center justify-center w-full h-9 text-sm font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-400"
							>
								{isCompleted ? "Zapped" : isPending ? "Processing..." : "Zap"}
							</button>
							{currentUser ? (
								<button
									type="button"
									onClick={(e) => showContextMenu(e)}
									className="inline-flex items-center gap-1.5"
								>
									<User.Provider pubkey={currentUser}>
										<User.Root>
											<User.Avatar className="size-6 rounded-full" />
										</User.Root>
									</User.Provider>
									<CaretDown
										className="mt-px size-3 text-neutral-500"
										weight="bold"
									/>
								</button>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
