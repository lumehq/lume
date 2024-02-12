import { useArk } from "@lume/ark";
import { Keys } from "@lume/types";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export const Route = createLazyFileRoute("/auth/create")({
	component: Create,
});

function Create() {
	const ark = useArk();
	const navigate = useNavigate();

	const [keys, setKeys] = useState<Keys>(null);

	const submit = async () => {
		const save = await ark.save_account(keys);
		if (save) {
			navigate({ to: "/" });
		} else {
			console.log("create failed");
		}
	};

	useEffect(() => {
		async function genKeys() {
			const cmd: Keys = await invoke("create_keys");
			setKeys(cmd);
		}

		genKeys();
	}, []);

	return (
		<div className="flex flex-col items-center justify-center w-screen h-screen">
			<div>
				<h3>Backup your key</h3>
				<div className="flex flex-col gap-2">
					{keys ? <input name="nsec" readOnly value={keys.nsec} /> : null}
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
