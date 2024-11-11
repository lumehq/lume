import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useTransition } from "react";
import * as Progress from "@radix-ui/react-progress";
import { Channel } from "@tauri-apps/api/core";
import { commands } from "@/commands.gen";
import { message } from "@tauri-apps/plugin-dialog";
import { Spinner } from "@/components";

export const Route = createLazyFileRoute("/settings/sync")({
	component: Screen,
});

function Screen() {
	const [channel, _setChannel] = useState<Channel<number>>(
		() => new Channel<number>(),
	);
	const [progress, setProgress] = useState(0);
	const [isPending, startTransition] = useTransition();

	const runSync = () => {
		startTransition(async () => {
			const res = await commands.syncAll(channel);

			if (res.status === "error") {
				await message(res.error, { kind: "error" });
			}

			return;
		});
	};

	useEffect(() => {
		channel.onmessage = (message) => {
			setProgress(message);
		};
	}, [channel]);

	return (
		<div className="w-full h-full px-3 pb-3">
			<div className="h-full flex flex-col w-full gap-2">
				<div>
					<h2 className="text-sm font-semibold">Sync events with Negentropy</h2>
					<p className="text-sm text-neutral-500">
						Learn more about negentropy{" "}
						<a
							href="https://github.com/hoytech/strfry/blob/nextneg/docs/negentropy.md"
							target="_blank"
							rel="noreferrer"
							className="text-blue-500 !underline"
						>
							here
						</a>
					</p>
				</div>
				<div className="text-sm flex flex-col gap-2">
					<h5 className="font-semibold">Data will be sync:</h5>
					<div className="w-full h-9 inline-flex items-center px-2 bg-black/5 dark:bg-white/5 rounded-lg text-neutral-700 dark:text-neutral-300">
						Metadata of all public keys that found in database.
					</div>
					<div className="w-full h-9 inline-flex items-center px-2 bg-black/5 dark:bg-white/5 rounded-lg text-neutral-700 dark:text-neutral-300">
						Contact list of all public keys that found in database.
					</div>
					<div className="w-full h-9 inline-flex items-center px-2 bg-black/5 dark:bg-white/5 rounded-lg text-neutral-700 dark:text-neutral-300">
						Follow and interest sets of all public keys that found in database.
					</div>
					<div className="w-full h-9 inline-flex items-center px-2 bg-black/5 dark:bg-white/5 rounded-lg text-neutral-700 dark:text-neutral-300">
						All notes and reposts of all public keys that found in database.
					</div>
					<div className="w-full h-9 inline-flex items-center px-2 bg-black/5 dark:bg-white/5 rounded-lg text-neutral-700 dark:text-neutral-300">
						All comments all public keys that found in database.
					</div>
				</div>
				<div className="relative mt-auto flex items-center gap-4 justify-between">
					<div className="flex-1">
						<Progress.Root
							className="relative overflow-hidden bg-black/20 dark:bg-white/20 rounded-full w-full h-1"
							style={{
								transform: "translateZ(0)",
							}}
							value={progress}
						>
							<Progress.Indicator
								className="bg-blue-500 size-full rounded-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
								style={{ transform: `translateX(-${100 - progress}%)` }}
							/>
						</Progress.Root>
					</div>
					<button
						type="button"
						disabled={isPending}
						onClick={() => runSync()}
						className="shrink-0 w-20 h-8 rounded-lg inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold"
					>
						{isPending ? <Spinner className="size-4" /> : "Sync"}
					</button>
				</div>
			</div>
		</div>
	);
}
