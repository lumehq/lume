import { User } from "@/components/user";
import { createLazyFileRoute } from "@tanstack/react-router";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { message } from "@tauri-apps/plugin-dialog";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";

const DEFAULT_VALUES = [21, 50, 100, 200];

export const Route = createLazyFileRoute("/zap/$id")({
	component: Screen,
});

function Screen() {
	const { event } = Route.useRouteContext();

	const [amount, setAmount] = useState(21);
	const [content, setContent] = useState("");
	const [isCompleted, setIsCompleted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const submit = async () => {
		try {
			// start loading
			setIsLoading(true);

			// Zap
			const val = await event.zap(amount, content);

			if (val) {
				setIsCompleted(true);
				// close current window
				await getCurrentWebviewWindow().close();
			}
		} catch (e) {
			setIsLoading(false);
			await message(String(e), {
				title: "Zap",
				kind: "error",
			});
		}
	};

	return (
		<div data-tauri-drag-region className="flex flex-col pb-5 size-full">
			<div
				data-tauri-drag-region
				className="flex items-center justify-center h-24 gap-2 shrink-0"
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
							className="h-11 w-full resize-none rounded-xl border-transparent bg-black/5 px-3 !outline-none placeholder:text-neutral-600 focus:border-blue-500 focus:ring-0 dark:bg-white/5"
						/>
						<button
							type="button"
							onClick={() => submit()}
							className="inline-flex items-center justify-center w-full h-10 font-medium rounded-xl bg-neutral-950 text-neutral-50 hover:bg-neutral-900 dark:bg-white/20 dark:hover:bg-white/30"
						>
							{isCompleted ? "Zapped" : isLoading ? "Processing..." : "Zap"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
