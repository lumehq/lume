import { KeyIcon, RemoteIcon } from "@lume/icons";
import { Link, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/landing")({
	component: Screen,
});

function Screen() {
	return (
		<div
			data-tauri-drag-region
			className="flex flex-col items-center justify-center w-screen h-screen"
		>
			<div className="w-full max-w-xs mx-auto lg:max-w-md">
				<div className="flex flex-col w-full gap-2 px-2 bg-white rounded-xl shadow-primary backdrop-blur-lg dark:bg-white/20 dark:ring-1 ring-neutral-800/50">
					<div className="flex items-center h-20 border-b border-neutral-100 dark:border-white/5">
						<Link
							to="/auth/create-profile"
							className="flex items-center justify-center w-full gap-2 px-2 rounded-lg h-14 hover:bg-neutral-100 dark:hover:bg-white/10"
						>
							<div className="inline-flex items-center justify-center rounded-full size-9 shrink-0">
								<img
									src="/icon.jpeg"
									alt="App Icon"
									className="object-cover rounded-full size-9"
								/>
							</div>
							<div className="inline-flex flex-col flex-1">
								<span className="font-semibold leading-tight">
									Create new account
								</span>
								<span className="text-sm leading-tight text-neutral-500">
									Use everywhere
								</span>
							</div>
						</Link>
					</div>
					<div className="flex flex-col gap-1 pb-2.5">
						<Link
							to="/auth/import"
							className="inline-flex items-center w-full gap-2 px-2 rounded-lg h-11 hover:bg-neutral-100 dark:hover:bg-white/10"
						>
							<div className="inline-flex items-center justify-center size-9">
								<KeyIcon className="size-5 text-neutral-600 dark:text-neutral-400" />
							</div>
							Login with Private Key
						</Link>
						<Link
							to="/auth/remote"
							className="inline-flex items-center w-full gap-2 px-2 rounded-lg h-11 hover:bg-neutral-100 dark:hover:bg-white/10"
						>
							<div className="inline-flex items-center justify-center size-9">
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
