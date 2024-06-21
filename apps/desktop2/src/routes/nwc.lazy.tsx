import { ZapIcon } from "@lume/icons";
import { NostrAccount } from "@lume/system";
import { Container } from "@lume/ui";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createLazyFileRoute("/nwc")({
	component: Screen,
});

function Screen() {
	const [uri, setUri] = useState("");
	const [isDone, setIsDone] = useState(false);

	const save = async () => {
		const nwc = await NostrAccount.setWallet(uri);
		setIsDone(nwc);
	};

	return (
		<Container withDrag>
			<div className="flex-1 w-full h-full px-5">
				<div className="flex flex-col gap-2">
					<div>
						<h3 className="text-2xl font-light">
							Connect <span className="font-semibold">bitcoin wallet</span> to
							start zapping to your favorite content and creator.
						</h3>
					</div>
				</div>
				<div className="flex flex-col gap-2 mt-10">
					<div className="flex flex-col gap-1.5">
						<label>Paste a Nostr Wallet Connect connection string</label>
						<textarea
							value={uri}
							onChange={(e) => setUri(e.target.value)}
							placeholder="nostrconnect://"
							className="w-full h-24 px-3 bg-transparent rounded-lg border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
					</div>
					<button
						type="button"
						onClick={save}
						className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-blue-500 px-5 font-medium text-white hover:bg-blue-600"
					>
						Save & Connect
					</button>
				</div>
			</div>
		</Container>
	);
}
