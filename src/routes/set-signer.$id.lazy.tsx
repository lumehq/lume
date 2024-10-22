import { commands } from "@/commands.gen";
import { Spinner, User } from "@/components";
import { Lock } from "@phosphor-icons/react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { message } from "@tauri-apps/plugin-dialog";
import { useState, useTransition } from "react";

export const Route = createLazyFileRoute("/set-signer/$id")({
	component: Screen,
});

function Screen() {
	const { id } = Route.useParams();

	const [password, setPassword] = useState("");
	const [isPending, startTransition] = useTransition();

	const unlock = () => {
		startTransition(async () => {
			if (!password.length) {
				await message("Password is required", { kind: "info" });
				return;
			}

			const window = getCurrentWindow();
			const res = await commands.setSigner(id, password);

			if (res.status === "ok") {
				await window.close();
			} else {
				await message(res.error, { kind: "error" });
				return;
			}
		});
	};

	return (
		<div
			data-tauri-drag-region
			className="size-full flex flex-col items-center justify-between gap-6 p-3"
		>
			<div
				data-tauri-drag-region
				className="flex-1 w-full px-10 flex flex-col gap-6 items-center justify-center"
			>
				<User.Provider pubkey={id}>
					<User.Root className="flex flex-col text-center gap-2">
						<User.Avatar className="size-12 rounded-full" />
						<User.Name className="font-semibold" />
					</User.Root>
				</User.Provider>
				<div className="w-full flex flex-col gap-2 items-center justify-center">
					<input
						name="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") unlock();
						}}
						disabled={isPending}
						placeholder="Enter password to unlock"
						className="px-3 w-full rounded-lg h-10 text-center bg-transparent border border-black/10 dark:border-white/10 focus:border-blue-500 focus:outline-none placeholder:text-neutral-400"
					/>
					<button
						type="button"
						onClick={() => unlock()}
						disabled={isPending}
						className="shrink-0 h-9 w-full rounded-lg inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400 text-white text-sm font-medium"
					>
						{isPending ? (
							<Spinner className="size-4" />
						) : (
							<Lock className="size-4" weight="bold" />
						)}
						Unlock
					</button>
				</div>
			</div>
			<div className="mt-auto">
				<button
					type="button"
					onClick={() => getCurrentWindow().close()}
					className="text-sm font-medium text-red-500"
				>
					Cancel
				</button>
			</div>
		</div>
	);
}
