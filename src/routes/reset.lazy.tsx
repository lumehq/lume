import { commands } from "@/commands.gen";
import { Frame, GoBack, Spinner } from "@/components";
import { createLazyFileRoute } from "@tanstack/react-router";
import { readText } from "@tauri-apps/plugin-clipboard-manager";
import { message } from "@tauri-apps/plugin-dialog";
import { useState, useTransition } from "react";

export const Route = createLazyFileRoute("/reset")({
	component: Screen,
});

function Screen() {
	const navigate = Route.useNavigate();

	const [key, setKey] = useState("");
	const [password, setPassword] = useState("");
	const [isPending, startTransition] = useTransition();

	const pasteFromClipboard = async () => {
		const val = await readText();
		setKey(val);
	};

	const submit = () => {
		startTransition(async () => {
			if (!key.startsWith("nsec1")) {
				await message(
					"You need to enter a valid private key starts with nsec",
					{ title: "Reset Password", kind: "info" },
				);
				return;
			}

			if (!password.length) {
				await message("You must set password to secure your key", {
					title: "Reset Password",
					kind: "info",
				});
				return;
			}

			const res = await commands.resetPassword(key, password);

			if (res.status === "ok") {
				navigate({ to: "/", replace: true });
			} else {
				await message(res.error, {
					title: "Import Private Ket",
					kind: "error",
				});
				return;
			}
		});
	};

	return (
		<div
			data-tauri-drag-region
			className="size-full flex items-center justify-center"
		>
			<div className="w-[320px] flex flex-col gap-8">
				<div className="flex flex-col gap-1 text-center">
					<h1 className="leading-tight text-xl font-semibold">
						Reset password
					</h1>
				</div>
				<div className="flex flex-col gap-3">
					<Frame
						className="flex flex-col gap-3 p-3 rounded-xl overflow-hidden"
						shadow
					>
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="key"
								className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
							>
								Private Key
							</label>
							<div className="relative">
								<input
									name="key"
									type="password"
									placeholder="nsec..."
									value={key}
									onChange={(e) => setKey(e.target.value)}
									className="pl-3 pr-12 rounded-lg w-full h-10 bg-transparent border border-neutral-200 dark:border-neutral-500 focus:border-blue-500 focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
								/>
								<button
									type="button"
									onClick={() => pasteFromClipboard()}
									className="absolute uppercase top-1/2 right-2 transform -translate-y-1/2 text-xs font-semibold text-blue-500"
								>
									Paste
								</button>
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<label
								htmlFor="password"
								className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
							>
								Set a new password
							</label>
							<input
								name="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="px-3 rounded-lg h-10 bg-transparent border border-neutral-200 dark:border-neutral-500 focus:border-blue-500 focus:outline-none"
							/>
						</div>
					</Frame>
					<div className="flex flex-col items-center gap-1">
						<button
							type="button"
							onClick={() => submit()}
							disabled={isPending}
							className="inline-flex items-center justify-center w-full h-9 text-sm font-semibold text-white bg-blue-500 rounded-lg shrink-0 hover:bg-blue-600 disabled:opacity-50"
						>
							{isPending ? <Spinner /> : "Continue"}
						</button>
						<GoBack className="mt-2 w-full text-sm text-neutral-600 dark:text-neutral-400 inline-flex items-center justify-center">
							Go back to previous screen
						</GoBack>
					</div>
				</div>
			</div>
		</div>
	);
}
