import { KeyIcon, RemoteIcon } from "@lume/icons";
import { Link, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/landing")({
	component: Screen,
});

function Screen() {
	return (
		<div
			data-tauri-drag-region
			className="flex flex-col justify-center items-center h-screen w-screen"
		>
			<div className="mx-auto max-w-xs lg:max-w-md w-full">
				<div className="flex w-full flex-col gap-2 bg-white rounded-xl shadow-primary backdrop-blur-lg dark:bg-white/20 dark:ring-1 ring-neutral-800/50 px-2">
					<div className="h-20 flex items-center border-b border-neutral-100 dark:border-white/5">
						<Link
							to="/auth/new/profile"
							className="h-14 w-full flex items-center justify-center gap-2 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-lg px-2"
						>
							<div className="size-9 shrink-0 rounded-full inline-flex items-center justify-center">
								<img
									src="/icon.jpeg"
									alt="App Icon"
									className="size-9 object-cover rounded-full"
								/>
							</div>
							<div className="flex-1 inline-flex flex-col">
								<span className="leading-tight font-semibold">
									Create new account
								</span>
								<span className="leading-tight text-sm text-neutral-500">
									Use everywhere
								</span>
							</div>
						</Link>
					</div>
					<div className="flex flex-col gap-1 pb-2.5">
						<Link
							to="/auth/privkey"
							className="inline-flex h-11 w-full items-center gap-2 rounded-lg px-2 hover:bg-neutral-100 dark:hover:bg-white/10"
						>
							<div className="size-9 inline-flex items-center justify-center">
								<KeyIcon className="size-5 text-neutral-600 dark:text-neutral-400" />
							</div>
							Login with Private Key
						</Link>
						<Link
							to="/auth/remote"
							className="inline-flex h-11 w-full items-center gap-2 rounded-lg px-2 hover:bg-neutral-100 dark:hover:bg-white/10"
						>
							<div className="size-9 inline-flex items-center justify-center">
								<RemoteIcon className="size-5 text-neutral-600 dark:text-neutral-400" />
							</div>
							Nostr Connect
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
