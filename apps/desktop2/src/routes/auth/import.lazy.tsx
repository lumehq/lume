import { useArk } from "@lume/ark";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

export const Route = createLazyFileRoute("/auth/import")({
	component: Import,
});

function Import() {
	const ark = useArk();
	const navigate = useNavigate();

	const [key, setKey] = useState("");

	const submit = async () => {
		if (!key.startsWith("nsec1")) return;
		if (key.length < 30) return;

		const npub: string = await invoke("get_public_key", { nsec: key });
		const keys = {
			npub,
			nsec: key,
		};

		const save = await ark.save_account(keys);
		if (save) {
			navigate({ to: "/" });
		} else {
			console.log("import failed");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center w-screen h-screen">
			<div>
				<h3>Import your key</h3>
				<div className="flex flex-col gap-2">
					<input
						name="nsec"
						value={key}
						onChange={(e) => setKey(e.target.value)}
					/>
					<button
						type="button"
						onClick={submit}
						className="w-full h-11 bg-gray-3 hover:bg-gray-4"
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
}
