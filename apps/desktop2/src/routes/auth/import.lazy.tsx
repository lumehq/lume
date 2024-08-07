import { NostrAccount } from "@lume/system";
import { Spinner } from "@lume/ui";
import { createLazyFileRoute } from "@tanstack/react-router";
import { message } from "@tauri-apps/plugin-dialog";
import { useState } from "react";

export const Route = createLazyFileRoute("/auth/import")({
	component: Screen,
});

function Screen() {
	const navigate = Route.useNavigate();

	const [key, setKey] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const submit = async () => {
		if (!key.startsWith("nsec1")) {
			return await message(
				"You need to enter a valid private key starts with nsec or ncryptsec",
				{ title: "Import Key", kind: "info" },
			);
		}

		try {
			setLoading(true);

			const npub = await NostrAccount.saveAccount(key, password);

			if (npub) {
				navigate({ to: "/", replace: true });
			}
		} catch (e) {
			setLoading(false);
			await message(String(e), { title: "Import Key", kind: "error" });
		}
	};

	return (
		<div className="flex flex-col items-center justify-center size-full gap-4">
			<div className="text-center">
				<h3 className="text-xl font-semibold">Continue with Private Key</h3>
			</div>
			<div className="flex flex-col w-full">
				<div className="flex flex-col gap-3 w-full p-3 overflow-hidden bg-white rounded-xl shadow-primary dark:bg-white/10 dark:ring-1 ring-white/15">
					<div className="flex flex-col gap-1">
						<label
							htmlFor="key"
							className="font-medium text-neutral-900 dark:text-neutral-100"
						>
							Private Key
						</label>
						<input
							name="key"
							type="text"
							placeholder="nsec or ncryptsec..."
							value={key}
							onChange={(e) => setKey(e.target.value)}
							className="px-3 border-transparent rounded-lg h-11 bg-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:ring-0 dark:bg-white/10 dark:placeholder:text-neutral-400"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label
							htmlFor="password"
							className="font-medium text-neutral-900 dark:text-neutral-100"
						>
							Password (Optional)
						</label>
						<input
							name="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="px-3 border-transparent rounded-lg h-11 bg-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:ring-0 dark:bg-white/10 dark:placeholder:text-neutral-400"
						/>
					</div>
				</div>
				<button
					type="button"
					onClick={() => submit()}
					disabled={loading}
					className="inline-flex items-center justify-center w-full h-9 mt-4 text-sm font-semibold text-white bg-blue-500 rounded-lg shrink-0 hover:bg-blue-600 disabled:opacity-50"
				>
					{loading ? <Spinner /> : "Login"}
				</button>
			</div>
		</div>
	);
}
