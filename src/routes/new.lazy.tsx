import { cn } from "@/commons";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/new")({
	component: Screen,
});

function Screen() {
	const { platform } = Route.useRouteContext();

	return (
		<div
			data-tauri-drag-region
			className={cn(
				"relative size-full flex items-center justify-center",
				platform === "windows"
					? "bg-neutral-200 dark:bg-neutral-900"
					: "bg-white/20 dark:bg-black/20",
			)}
		>
			<div className="w-[350px] flex flex-col gap-8">
				<div className="flex flex-col gap-1 text-center">
					<h1 className="leading-tight text-lg font-semibold">
						How would you like to use Lume?
					</h1>
				</div>
				<div className="flex flex-col gap-4">
					<a
						href="/new-account/connect"
						className="w-full p-4 rounded-xl hover:shadow-lg hover:ring-0 hover:bg-white dark:hover:bg-neutral-800 ring-1 ring-black/5 dark:ring-white/5"
					>
						<h3 className="mb-1 font-medium">Continue with Nostr Connect</h3>
						<p className="text-xs text-neutral-500 dark:text-neutral-500">
							Your account will be handled by a remote signer. Lume will not
							store your account keys.
						</p>
					</a>
					<a
						href="/new-account/import"
						className="w-full p-4 rounded-xl hover:shadow-lg hover:ring-0 hover:bg-white dark:hover:bg-neutral-800 ring-1 ring-black/5 dark:ring-white/5"
					>
						<h3 className="mb-1 font-medium">Continue with Secret Key</h3>
						<p className="text-xs text-neutral-500 dark:text-neutral-500">
							Lume will store your keys in secure storage. You can provide a
							password to add extra security.
						</p>
					</a>
					<a
						href="/new-account/watch"
						className="w-full p-4 rounded-xl hover:shadow-lg hover:ring-0 hover:bg-white dark:hover:bg-neutral-800 ring-1 ring-black/5 dark:ring-white/5"
					>
						<h3 className="mb-1 font-medium">
							Continue with Public Key (Watch Mode)
						</h3>
						<p className="text-xs text-neutral-500 dark:text-neutral-500">
							Use for experience without provide your private key, you can add
							it later to publish new note.
						</p>
					</a>
					<div className="flex items-center justify-between gap-2">
						<div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
						<div className="shrink-0 text-sm text-neutral-500 dark:text-neutral-400">
							Do you not have a Nostr account yet?
						</div>
						<div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
					</div>
					<div className="flex flex-col gap-2">
						<a
							href="https://nsec.app"
							target="_blank"
							rel="noreferrer"
							className="text-sm bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg flex items-center gap-1.5 h-9 px-1"
						>
							<div className="size-7 rounded-md bg-black inline-flex items-center justify-center">
								<img src="/nsec_app.svg" alt="nsec.app" className="size-5" />
							</div>
							Create one with nsec.app
						</a>
						<a
							href="https://nosta.me"
							target="_blank"
							rel="noreferrer"
							className="text-sm bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg flex items-center gap-1.5 h-9 px-1"
						>
							<div className="size-7 rounded-md bg-black overflow-hidden">
								<img
									src="/nosta.jpg"
									alt="nosta"
									className="size-7 object-cover"
								/>
							</div>
							Create one with nosta.me
						</a>
						<p className="text-xs text-neutral-400 dark:text-neutral-600">
							Or you can create account from other Nostr clients.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
