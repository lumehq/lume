import { Spinner } from "@/components";
import { NostrAccount } from "@/system";
import type { ColumnRouteSearch } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { message } from "@tauri-apps/plugin-dialog";
import { useState } from "react";

export const Route = createFileRoute("/create-newsfeed/f2f")({
	validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
		return {
			account: search.account,
			label: search.label,
			name: search.name,
		};
	},
	component: Screen,
});

function Screen() {
	const navigate = Route.useNavigate();
	const { redirect } = Route.useSearch();

	const [npub, setNpub] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const submit = async () => {
		if (!npub.startsWith("npub1")) {
			return await message("You must enter a valid npub.", {
				title: "Create Newsfeed",
				kind: "info",
			});
		}

		try {
			setIsLoading(true);

			const sync = await NostrAccount.f2f(npub);

			if (sync) {
				return navigate({ to: redirect });
			}
		} catch (e) {
			setIsLoading(false);
			await message(String(e), {
				title: "Create Newsfeed",
				kind: "error",
			});
		}
	};

	return (
		<div className="overflow-y-auto scrollbar-none p-2 shrink-0 h-[450px] bg-white dark:bg-white/20 rounded-xl shadow-primary dark:ring-1 ring-neutral-800/50">
			<div className="flex flex-col justify-between h-full">
				<div className="flex-1 flex flex-col gap-1.5 justify-center px-5">
					<p className="font-semibold text-neutral-500">
						You already have a friend on Nostr?
					</p>
					<p>Instead of building the timeline by yourself.</p>
					<p className="font-semibold text-neutral-500">
						Just enter your friend's{" "}
						<span className="text-blue-500">npub.</span>
					</p>
					<p>
						You will have the same experience as your friend. Of course, you
						always can edit your network later.
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<div className="flex flex-col gap-1">
						<label htmlFor="npub" className="text-sm font-medium">
							NPUB
						</label>
						<input
							name="npub"
							placeholder="npub1..."
							value={npub}
							onChange={(e) => setNpub(e.target.value)}
							spellCheck={false}
							className="px-3 bg-transparent border rounded-lg h-11 border-neutral-200 dark:border-neutral-800 placeholder:text-neutral-600 focus:border-blue-500 focus:ring-0 dark:placeholder:text-neutral-400"
						/>
					</div>
					<button
						type="button"
						onClick={() => submit()}
						className="inline-flex items-center justify-center w-full text-sm font-medium text-white bg-blue-500 rounded-lg h-9 hover:bg-blue-600"
					>
						{isLoading ? <Spinner /> : "Confirm"}
					</button>
				</div>
			</div>
		</div>
	);
}
