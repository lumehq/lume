import { Balance } from "@/components/balance";
import { User } from "@/components/user";
import { LumeEvent } from "@lume/system";
import { Box, Container } from "@lume/ui";
import { createLazyFileRoute } from "@tanstack/react-router";
import { getCurrent } from "@tauri-apps/api/webviewWindow";
import { message } from "@tauri-apps/plugin-dialog";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useTranslation } from "react-i18next";

const DEFAULT_VALUES = [69, 100, 200, 500];

export const Route = createLazyFileRoute("/zap/$id")({
	component: Screen,
});

function Screen() {
	const { t } = useTranslation();
	const { id } = Route.useParams();
	// @ts-ignore, magic !!!
	const { pubkey, account } = Route.useSearch();

	const [amount, setAmount] = useState(21);
	const [content, setContent] = useState("");
	const [isCompleted, setIsCompleted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const submit = async () => {
		try {
			// start loading
			setIsLoading(true);

			const val = await LumeEvent.zap(id, amount, content);

			if (val) {
				setIsCompleted(true);
				const window = getCurrent();
				// close current window
				window.close();
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
		<Container>
			<Balance account={account} />
			<Box className="flex flex-col gap-3">
				<div className="flex flex-col justify-between h-full py-5">
					<div className="flex items-center justify-center gap-2 h-11 shrink-0">
						{t("note.zap.modalTitle")}{" "}
						<User.Provider pubkey={pubkey}>
							<User.Root className="inline-flex items-center gap-2 p-1 rounded-full bg-neutral-100 dark:bg-neutral-900">
								<User.Avatar className="rounded-full size-6" />
								<User.Name className="pr-2 text-sm font-medium" />
							</User.Root>
						</User.Provider>
					</div>
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
										className="w-max rounded-full bg-neutral-100 px-2.5 py-1 text-sm font-medium hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
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
								placeholder={t("note.zap.messagePlaceholder")}
								className="h-11 w-full resize-none rounded-lg border-transparent bg-neutral-100 px-3 !outline-none placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-950 dark:text-neutral-400"
							/>
							<div className="flex flex-col gap-2">
								<button
									type="button"
									onClick={() => submit()}
									className="inline-flex h-9 w-full items-center justify-center rounded-lg border-t border-neutral-900 bg-neutral-950 pb-[2px] font-semibold text-neutral-50 hover:bg-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
								>
									{isCompleted
										? t("note.zap.buttonFinish")
										: isLoading
											? t("note.zap.buttonLoading")
											: t("note.zap.zap")}
								</button>
							</div>
						</div>
					</div>
				</div>
			</Box>
		</Container>
	);
}
