import { GoBack } from "@/components";
import { ArrowLeft } from "@phosphor-icons/react";
import { Link, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/new")({
	component: Screen,
});

function Screen() {
	return (
		<div
			data-tauri-drag-region
			className="relative size-full flex items-center justify-center"
		>
			<div className="w-[320px] flex flex-col gap-8">
				<div className="flex flex-col gap-1 text-center">
					<h1 className="leading-tight text-xl font-semibold">
						Welcome to Nostr.
					</h1>
				</div>
				<div className="flex flex-col gap-4">
					<Link
						to="/auth/new"
						className="w-full h-10 bg-blue-500 font-medium hover:bg-blue-600 text-white rounded-lg inline-flex items-center justify-center shadow"
					>
						Create a new identity
					</Link>
					<div className="w-full h-px bg-black/5 dark:bg-white/5" />
					<div className="flex flex-col gap-2">
						<Link
							to="/auth/connect"
							className="w-full h-10 bg-white hover:bg-neutral-100 dark:hover:bg-neutral-100 dark:text-black rounded-lg inline-flex items-center justify-center"
						>
							Login with Nostr Connect
						</Link>
						<Link
							to="/auth/import"
							className="w-full h-10 bg-white hover:bg-neutral-100 dark:hover:bg-neutral-100 dark:text-black rounded-lg inline-flex items-center justify-center"
						>
							Login with Private Key
						</Link>
					</div>
				</div>
			</div>
			<GoBack className="fixed top-11 left-2 flex items-center gap-1.5 text-sm font-medium">
				<ArrowLeft className="size-5" />
				Back
			</GoBack>
		</div>
	);
}
